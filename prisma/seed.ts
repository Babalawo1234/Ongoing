import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient() as unknown as any;

async function main() {
  console.log('🌱 Starting database seed...');

  // Read JSON files
  const dataPath = path.join(__dirname, '..', 'app', 'lib', 'data', 'normalized');

  const departments = JSON.parse(
    fs.readFileSync(path.join(dataPath, 'departments.json'), 'utf-8')
  );
  const catalogYears = JSON.parse(
    fs.readFileSync(path.join(dataPath, 'catalog_years.json'), 'utf-8')
  );
  const programs = JSON.parse(
    fs.readFileSync(path.join(dataPath, 'programs.json'), 'utf-8')
  );
  const courses = JSON.parse(
    fs.readFileSync(path.join(dataPath, 'courses.json'), 'utf-8')
  );
  const programCourses = JSON.parse(
    fs.readFileSync(path.join(dataPath, 'program_courses.json'), 'utf-8')
  );
  const prerequisites = JSON.parse(
    fs.readFileSync(path.join(dataPath, 'prerequisites.json'), 'utf-8')
  );

  // 1. Seed Departments
  console.log('📚 Seeding departments...');
  for (const dept of departments) {
    await prisma.department.upsert({
      where: { id: dept.department_id },
      update: {},
      create: {
        id: dept.department_id,
        departmentName: dept.department_name,
        school: dept.school,
      },
    });
  }
  console.log(`✅ Seeded ${departments.length} departments`);

  // 2. Seed Catalog Years
  console.log('📅 Seeding catalog years...');
  for (const cy of catalogYears) {
    await prisma.catalogYear.upsert({
      where: { id: cy.catalog_year_id },
      update: {},
      create: {
        id: cy.catalog_year_id,
        year: cy.year,
        isActive: cy.is_active,
      },
    });
  }
  console.log(`✅ Seeded ${catalogYears.length} catalog years`);

  // 3. Seed Courses
  console.log('📖 Seeding courses...');
  await prisma.course.deleteMany(); // Clear existing courses
  await prisma.course.createMany({
    data: courses.map((course: any) => ({
      id: course.course_id,
      courseCode: course.course_code,
      courseName: course.course_name,
      credits: course.credits,
      departmentId: course.department_id,
    })),
    skipDuplicates: true,
  });
  console.log(`✅ Seeded ${courses.length} courses`);

  // 4. Seed Programs
  console.log('🎓 Seeding programs...');
  await prisma.program.deleteMany();
  await prisma.program.createMany({
    data: programs.map((program: any) => ({
      id: program.program_id,
      programName: program.program_name,
      degreeType: program.degree_type,
      totalCreditsRequired: program.total_credits_required,
      catalogYearId: program.catalog_year_id,
      departmentId: program.department_id,
    })),
    skipDuplicates: true,
  });
  console.log(`✅ Seeded ${programs.length} programs`);

  // 5. Seed Program-Course relationships
  console.log('🔗 Seeding program-course relationships...');
  await prisma.programCourse.deleteMany();
  await prisma.programCourse.createMany({
    data: programCourses.map((pc: any) => ({
      programId: pc.program_id,
      courseId: pc.course_id,
      core: pc.core,
      isGened: pc.is_gened,
      isMajor: pc.is_major,
      elective: pc.elective,
      yearRequired: pc.year_required,
      semester: pc.semester,
      concentration: pc.concentration,
    })),
    skipDuplicates: true,
  });
  console.log(`✅ Seeded ${programCourses.length} program-course relationships`);

  // 6. Seed Prerequisites
  console.log('🔗 Seeding prerequisites...');
  await prisma.prerequisite.deleteMany();
  await prisma.prerequisite.createMany({
    data: prerequisites.map((prereq: any) => ({
      courseId: prereq.course_id,
      prerequisiteCourseId: prereq.prerequisite_course_id,
      isMandatory: prereq.is_mandatory,
    })),
    skipDuplicates: true,
  });
  console.log(`✅ Seeded ${prerequisites.length} prerequisites`);

  // 7. Create default users (Admin and Academic Registry)
  console.log('👥 Creating default users...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@aun.edu' },
    update: {},
    create: {
      email: 'admin@aun.edu',
      password: hashedPassword,
      name: 'Admin',
      fullName: 'System Administrator',
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'registry@aun.edu' },
    update: {},
    create: {
      email: 'registry@aun.edu',
      password: hashedPassword,
      name: 'Registry',
      fullName: 'Academic Registry',
      role: 'academic',
    },
  });

  console.log('✅ Created default admin and registry users');
  console.log('   📧 admin@aun.edu / admin123');
  console.log('   📧 registry@aun.edu / admin123');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
