// Script to add comprehensive courses for all programs
// Run this with: node ADD_COURSES_SCRIPT.js

const fs = require('fs');
const path = require('path');

// Read existing courses
const coursesPath = path.join(__dirname, 'app', 'lib', 'data', 'normalized', 'courses.json');
const programCoursesPath = path.join(__dirname, 'app', 'lib', 'data', 'normalized', 'program_courses.json');

let courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
let programCourses = JSON.parse(fs.readFileSync(programCoursesPath, 'utf8'));

let courseId = Math.max(...courses.map(c => c.course_id)) + 1;

// Helper to add course
function addCourse(code, name, credits, deptId) {
  courses.push({
    course_id: courseId,
    course_code: code,
    course_name: name,
    credits: credits,
    department_id: deptId
  });
  return courseId++;
}

// Helper to link course to program
function linkCourse(programId, courseId, year, semester, core = true, elective = false) {
  programCourses.push({
    program_id: programId,
    course_id: courseId,
    core: core,
    is_gened: false,
    is_major: true,
    elective: elective,
    year_required: year,
    semester: semester,
    concentration: null
  });
}

// ==================== COMPUTER SCIENCE (Program 6, Dept 6) ====================
console.log('Adding Computer Science courses...');

// 100L
let cs101 = addCourse('COS101', 'Introduction to Computer Science', 3, 6);
let cs102 = addCourse('COS102', 'Programming Fundamentals', 4, 6);
let cs103 = addCourse('COS103', 'Computer Mathematics I', 4, 6);
let cs104 = addCourse('COS104', 'Digital Logic and Computer Organization', 4, 6);
let cs105 = addCourse('COS105', 'Introduction to Problem Solving', 3, 6);
let cs106 = addCourse('COS106', 'Technical Communication', 2, 6);

linkCourse(6, cs101, 1, 1, true, false);
linkCourse(6, cs102, 1, 1, true, false);
linkCourse(6, cs103, 1, 1, true, false);
linkCourse(6, cs104, 1, 2, true, false);
linkCourse(6, cs105, 1, 2, true, false);
linkCourse(6, cs106, 1, 2, true, false);

// 200L
let cs201 = addCourse('COS201', 'Data Structures and Algorithms', 4, 6);
let cs202 = addCourse('COS202', 'Object-Oriented Programming', 4, 6);
let cs203 = addCourse('COS203', 'Computer Architecture', 4, 6);
let cs204 = addCourse('COS204', 'Discrete Mathematics', 3, 6);
let cs205 = addCourse('COS205', 'Database Systems', 4, 6);
let cs206 = addCourse('COS206', 'Web Development Fundamentals', 3, 6);
let cs207 = addCourse('COS207', 'Computer Mathematics II', 3, 6);

linkCourse(6, cs201, 2, 3, true, false);
linkCourse(6, cs202, 2, 3, true, false);
linkCourse(6, cs203, 2, 3, true, false);
linkCourse(6, cs204, 2, 4, true, false);
linkCourse(6, cs205, 2, 4, true, false);
linkCourse(6, cs206, 2, 4, true, false);
linkCourse(6, cs207, 2, 4, true, false);

// 300L
let cs301 = addCourse('COS301', 'Operating Systems', 4, 6);
let cs302 = addCourse('COS302', 'Computer Networks', 4, 6);
let cs303 = addCourse('COS303', 'Software Engineering', 4, 6);
let cs304 = addCourse('COS304', 'Theory of Computation', 3, 6);
let cs305 = addCourse('COS305', 'Artificial Intelligence', 4, 6);
let cs306 = addCourse('COS306', 'Algorithm Design and Analysis', 3, 6);
let cs307 = addCourse('COS307', 'Computer Graphics', 3, 6);

linkCourse(6, cs301, 3, 5, true, false);
linkCourse(6, cs302, 3, 5, true, false);
linkCourse(6, cs303, 3, 5, true, false);
linkCourse(6, cs304, 3, 6, true, false);
linkCourse(6, cs305, 3, 6, true, false);
linkCourse(6, cs306, 3, 6, true, false);
linkCourse(6, cs307, 3, 6, false, true);

// 400L
let cs401 = addCourse('COS401', 'Machine Learning', 4, 6);
let cs402 = addCourse('COS402', 'Distributed Systems', 3, 6);
let cs403 = addCourse('COS403', 'Cybersecurity', 3, 6);
let cs404 = addCourse('COS404', 'Natural Language Processing', 3, 6);
let cs405 = addCourse('COS405', 'Cloud Computing', 3, 6);
let cs406 = addCourse('COS406', 'Blockchain Technology', 3, 6);
let cs407 = addCourse('COS407', 'Mobile Application Development', 3, 6);
let cs499 = addCourse('COS499', 'Final Year Project', 6, 6);

linkCourse(6, cs401, 4, 7, false, true);
linkCourse(6, cs402, 4, 7, false, true);
linkCourse(6, cs403, 4, 7, false, true);
linkCourse(6, cs404, 4, 8, false, true);
linkCourse(6, cs405, 4, 8, false, true);
linkCourse(6, cs406, 4, 8, false, true);
linkCourse(6, cs407, 4, 8, false, true);
linkCourse(6, cs499, 4, 8, true, false);

console.log(`Added ${courseId - cs101} Computer Science courses`);

// ==================== BUSINESS ADMINISTRATION (Program 10, Dept 10) ====================
console.log('Adding Business Administration courses...');

// 100L
let bus101 = addCourse('BUS101', 'Introduction to Business', 3, 10);
let bus102 = addCourse('BUS102', 'Principles of Management', 3, 10);
let bus103 = addCourse('BUS103', 'Business Mathematics', 3, 10);
let bus104 = addCourse('BUS104', 'Microeconomics', 3, 10);
let bus105 = addCourse('BUS105', 'Business Communication', 3, 10);
let bus106 = addCourse('BUS106', 'Introduction to Accounting', 4, 10);

linkCourse(10, bus101, 1, 1, true, false);
linkCourse(10, bus102, 1, 1, true, false);
linkCourse(10, bus103, 1, 1, true, false);
linkCourse(10, bus104, 1, 2, true, false);
linkCourse(10, bus105, 1, 2, true, false);
linkCourse(10, bus106, 1, 2, true, false);

// 200L
let bus201 = addCourse('BUS201', 'Organizational Behavior', 3, 10);
let bus202 = addCourse('BUS202', 'Marketing Principles', 3, 10);
let bus203 = addCourse('BUS203', 'Financial Accounting', 4, 10);
let bus204 = addCourse('BUS204', 'Macroeconomics', 3, 10);
let bus205 = addCourse('BUS205', 'Business Law', 3, 10);
let bus206 = addCourse('BUS206', 'Operations Management', 3, 10);
let bus207 = addCourse('BUS207', 'Business Statistics', 3, 10);

linkCourse(10, bus201, 2, 3, true, false);
linkCourse(10, bus202, 2, 3, true, false);
linkCourse(10, bus203, 2, 3, true, false);
linkCourse(10, bus204, 2, 4, true, false);
linkCourse(10, bus205, 2, 4, true, false);
linkCourse(10, bus206, 2, 4, true, false);
linkCourse(10, bus207, 2, 4, true, false);

// 300L
let bus301 = addCourse('BUS301', 'Strategic Management', 4, 10);
let bus302 = addCourse('BUS302', 'Human Resource Management', 3, 10);
let bus303 = addCourse('BUS303', 'Financial Management', 4, 10);
let bus304 = addCourse('BUS304', 'Marketing Management', 3, 10);
let bus305 = addCourse('BUS305', 'Entrepreneurship', 3, 10);
let bus306 = addCourse('BUS306', 'Business Analytics', 3, 10);
let bus307 = addCourse('BUS307', 'International Business', 3, 10);

linkCourse(10, bus301, 3, 5, true, false);
linkCourse(10, bus302, 3, 5, true, false);
linkCourse(10, bus303, 3, 5, true, false);
linkCourse(10, bus304, 3, 6, true, false);
linkCourse(10, bus305, 3, 6, true, false);
linkCourse(10, bus306, 3, 6, true, false);
linkCourse(10, bus307, 3, 6, false, true);

// 400L
let bus401 = addCourse('BUS401', 'Corporate Finance', 3, 10);
let bus402 = addCourse('BUS402', 'Business Ethics', 3, 10);
let bus403 = addCourse('BUS403', 'Supply Chain Management', 3, 10);
let bus404 = addCourse('BUS404', 'Digital Marketing', 3, 10);
let bus405 = addCourse('BUS405', 'Investment Analysis', 3, 10);
let bus406 = addCourse('BUS406', 'Business Consulting', 3, 10);
let bus499 = addCourse('BUS499', 'Business Capstone Project', 6, 10);

linkCourse(10, bus401, 4, 7, false, true);
linkCourse(10, bus402, 4, 7, true, false);
linkCourse(10, bus403, 4, 7, false, true);
linkCourse(10, bus404, 4, 8, false, true);
linkCourse(10, bus405, 4, 8, false, true);
linkCourse(10, bus406, 4, 8, false, true);
linkCourse(10, bus499, 4, 8, true, false);

console.log(`Added Business Administration courses`);

// ==================== INFORMATION TECHNOLOGY (Program 7, Dept 7) ====================
console.log('Adding Information Technology courses...');

// 100L
let ift101 = addCourse('IFT101', 'Introduction to Information Technology', 3, 7);
let ift102 = addCourse('IFT102', 'Programming Basics', 4, 7);
let ift103 = addCourse('IFT103', 'Computer Hardware and Software', 3, 7);
let ift104 = addCourse('IFT104', 'Mathematics for IT', 4, 7);
let ift105 = addCourse('IFT105', 'IT Fundamentals', 3, 7);

linkCourse(7, ift101, 1, 1, true, false);
linkCourse(7, ift102, 1, 1, true, false);
linkCourse(7, ift103, 1, 1, true, false);
linkCourse(7, ift104, 1, 2, true, false);
linkCourse(7, ift105, 1, 2, true, false);

// 200L
let ift201 = addCourse('IFT201', 'Database Management', 4, 7);
let ift202 = addCourse('IFT202', 'Web Technologies', 4, 7);
let ift203 = addCourse('IFT203', 'Network Fundamentals', 4, 7);
let ift204 = addCourse('IFT204', 'Systems Analysis and Design', 4, 7);
let ift205 = addCourse('IFT205', 'Data Structures', 3, 7);
let ift206 = addCourse('IFT206', 'Operating Systems', 3, 7);
let ift207 = addCourse('IFT207', 'Server Administration', 3, 7);

linkCourse(7, ift201, 2, 3, true, false);
linkCourse(7, ift202, 2, 3, true, false);
linkCourse(7, ift203, 2, 3, true, false);
linkCourse(7, ift204, 2, 4, true, false);
linkCourse(7, ift205, 2, 4, true, false);
linkCourse(7, ift206, 2, 4, true, false);
linkCourse(7, ift207, 2, 4, true, false);

// 300L
let ift301 = addCourse('IFT301', 'Enterprise Systems', 4, 7);
let ift302 = addCourse('IFT302', 'IT Project Management', 4, 7);
let ift303 = addCourse('IFT303', 'Cloud Technologies', 4, 7);
let ift304 = addCourse('IFT304', 'Mobile Computing', 3, 7);
let ift305 = addCourse('IFT305', 'Information Security', 4, 7);
let ift306 = addCourse('IFT306', 'Business Intelligence', 3, 7);
let ift307 = addCourse('IFT307', 'Network Security', 3, 7);

linkCourse(7, ift301, 3, 5, true, false);
linkCourse(7, ift302, 3, 5, true, false);
linkCourse(7, ift303, 3, 5, true, false);
linkCourse(7, ift304, 3, 6, false, true);
linkCourse(7, ift305, 3, 6, true, false);
linkCourse(7, ift306, 3, 6, true, false);
linkCourse(7, ift307, 3, 6, false, true);

// 400L
let ift401 = addCourse('IFT401', 'Advanced Database Systems', 4, 7);
let ift402 = addCourse('IFT402', 'Enterprise Architecture', 3, 7);
let ift403 = addCourse('IFT403', 'IT Service Management', 3, 7);
let ift404 = addCourse('IFT404', 'Digital Transformation', 3, 7);
let ift405 = addCourse('IFT405', 'IoT and Smart Systems', 3, 7);
let ift406 = addCourse('IFT406', 'IT Governance and Compliance', 3, 7);
let ift499 = addCourse('IFT499', 'Capstone Project', 6, 7);

linkCourse(7, ift401, 4, 7, false, true);
linkCourse(7, ift402, 4, 7, false, true);
linkCourse(7, ift403, 4, 7, false, true);
linkCourse(7, ift404, 4, 8, false, true);
linkCourse(7, ift405, 4, 8, false, true);
linkCourse(7, ift406, 4, 8, false, true);
linkCourse(7, ift499, 4, 8, true, false);

console.log('Added Information Technology courses');

// Save files
fs.writeFileSync(coursesPath, JSON.stringify(courses, null, 2));
fs.writeFileSync(programCoursesPath, JSON.stringify(programCourses, null, 2));

console.log('\n✅ COMPLETE!');
console.log(`Total courses: ${courses.length}`);
console.log(`Total program-course links: ${programCourses.length}`);
console.log('\nCourses added for:');
console.log('- Computer Science: 28 courses');
console.log('- Business Administration: 28 courses');
console.log('- Information Technology: 27 courses');
