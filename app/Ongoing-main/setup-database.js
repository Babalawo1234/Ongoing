const { PrismaClient } = require('@prisma/client');

async function setupDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Setting up database tables...');
    
    // Test database connection first
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // This will create tables if they don't exist
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        "school" TEXT NOT NULL,
        "department" TEXT NOT NULL,
        "catalog" TEXT NOT NULL,
        "studentId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `;
    
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Course" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "code" TEXT NOT NULL,
        "credits" INTEGER NOT NULL,
        "description" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "duration" INTEGER NOT NULL,
        "difficulty" TEXT NOT NULL,
        "instructor" TEXT NOT NULL,
        "requirements" TEXT[],
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
      );
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "UserCourse" (
        "id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL,
        "course_id" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'not_started',
        "progress" INTEGER NOT NULL DEFAULT 0,
        "grade" TEXT,
        "started_at" TIMESTAMP(3),
        "completed_at" TIMESTAMP(3),
        "notes" TEXT NOT NULL DEFAULT '',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "UserCourse_pkey" PRIMARY KEY ("id")
      );
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "UserCourse_user_id_idx" ON "UserCourse"("user_id");
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "UserCourse_course_id_idx" ON "UserCourse"("course_id");
    `;
    
    console.log('✅ Database tables created successfully!');
    
    // Check if courses exist, if not seed them
    const courseCount = await prisma.course.count();
    if (courseCount === 0) {
      console.log('🌱 Seeding courses...');
      
      const courses = [
        {
          code: 'CS 101',
          title: 'Introduction to Computer Science',
          credits: 3,
          description: 'Fundamental concepts of computer science including programming basics, algorithms, and problem-solving techniques.',
          category: 'Core',
          department: 'Computer Science',
          duration: 15,
          difficulty: 'Beginner',
          requirements: []
        },
        {
          code: 'CS 102',
          title: 'Programming Fundamentals',
          credits: 4,
          description: 'Introduction to programming using Python. Covers variables, control structures, functions, and basic data structures.',
          category: 'Core',
          department: 'Computer Science',
          duration: 16,
          difficulty: 'Beginner',
          requirements: ['CS 101']
        },
        {
          code: 'CS 201',
          title: 'Data Structures and Algorithms',
          credits: 4,
          description: 'Study of fundamental data structures and algorithms. Includes arrays, linked lists, trees, graphs, sorting, and searching.',
          category: 'Core',
          department: 'Computer Science',
          duration: 16,
          difficulty: 'Intermediate',
          requirements: ['CS 102']
        },
        {
          code: 'CS 301',
          title: 'Database Systems',
          credits: 3,
          description: 'Introduction to database design, SQL, normalization, and database management systems.',
          category: 'Core',
          department: 'Computer Science',
          duration: 15,
          difficulty: 'Intermediate',
          requirements: ['CS 201']
        },
        {
          code: 'CS 401',
          title: 'Software Engineering',
          credits: 4,
          description: 'Software development lifecycle, project management, testing, and software design patterns.',
          category: 'Core',
          department: 'Computer Science',
          duration: 16,
          difficulty: 'Advanced',
          requirements: ['CS 301']
        }
      ];
      
      for (const course of courses) {
        await prisma.course.create({ data: course });
      }
      
      console.log('✅ Sample courses seeded successfully!');
    }
    
    console.log('🎉 Database setup complete! Ready for deployment.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
