// ==========================================
// STUDENT INFORMATION SYSTEM
// ==========================================

// ---------- 10 LET VARIABLES ----------

let studentName = "Liza Mae";
let age = 25;
let yearLevel = 3;
let course = "Bachelor of Science in  Computer Science";
let school = "Northwest Samar State University";
let section = "CS-3A";
let grade1 = 90;
let grade2 = 85;
let grade3 = 95;
let status = "Regular Student";


// ---------- 10 CONST VARIABLES ----------

const studentID = "20-01161";
const city = "Calbayog";
const subject1 = "Programming";
const subject2 = "Networking";
const subject3 = "Database";
const passingGrade = 75;
const semester = "First Semester";
const teacher = "Mr. Ortiz";
const room = "Laboratory 2";
const maxGrade = 100;


// ---------- 5 ARROW FUNCTIONS ----------

// Arrow Function 1
const getAverage = (a, b, c) => {
    return (a + b + c) / 3;
};

// Arrow Function 2
const checkStatus = (grade) => {
    return grade >= passingGrade ? "Passed" : "Failed";
};

// Arrow Function 3
const greetStudent = (name) => {
    return `Hello, ${name}!`;
};

// Arrow Function 4
const getFullCourse = (course) => {
    return `Course: ${course}`;
};

// Arrow Function 5
const displayStudent = (name, id) => {
    return `Student: ${name} | ID: ${id}`;
};


// ---------- TEMPLATE LITERALS ----------

console.log(`Student Name: ${studentName}`);
console.log(`Age: ${age}`);
console.log(`Year Level: ${yearLevel}`);
console.log(`Course: ${course}`);
console.log(`School: ${school}`);
console.log(`Section: ${section}`);
console.log(`Student ID: ${studentID}`);
console.log(`City: ${city}`);
console.log(`Semester: ${semester}`);
console.log(`Teacher: ${teacher}`);


// ---------- DESTRUCTURED ARRAYS ----------

const grades = [90, 85, 95];

const [firstGrade, secondGrade, thirdGrade] = grades;

console.log(`First Grade: ${firstGrade}`);

const subjects = ["Programming", "Networking", "Database"];

const [firstSubject, secondSubject, thirdSubject] = subjects;

console.log(`First Subject: ${firstSubject}`);

const names = ["Macey", "Stephanie", "Kristian"];

const [firstStudent, secondStudent, thirdStudent] = names;

console.log(`First Student: ${firstStudent}`);


// ---------- DESTRUCTURED OBJECT LITERALS ----------

const student = {
    name: "Liza Mae",
    age: 25,
    course: "CS",
    year: 3
};

const { name, age: studentAge, course: studentCourse } = student;

console.log(`Name: ${name}`);

const schoolInfo = {
    schoolName: "Northwest Samar State University",
    location: "Calbayog",
    campus: "Main Campus"
};

const {
    schoolName,
    location,
    campus
} = schoolInfo;

console.log(`School: ${schoolName}`);

const teacherInfo = {
    teacherName: "Mr. Ortiz",
    subject: "Programming",
    roomNumber: "Laboratory 2"
};

const {
    teacherName,
    subject,
    roomNumber
} = teacherInfo;

console.log(`Teacher: ${teacherName}`);


// ---------- 2 ARRAYS USING SPREAD OPERATOR ----------

const basicSubjects = ["Programming", "Networking"];

const allSubjects = [
    ...basicSubjects,
    "Database",
    "Web Development"
];

console.log(`All Subjects: ${allSubjects}`);

const firstGrades = [90, 85];

const completeGrades = [
    ...firstGrades,
    95,
    88
];

console.log(`Complete Grades: ${completeGrades}`);


// ---------- 2 OBJECT LITERALS USING SPREAD OPERATOR ----------

const basicStudent = {
    name: "Macey",
    age: 21
};

const completeStudent = {
    ...basicStudent,
    course: "IT",
    yearLevel: 2
};

console.log(`Complete Student: ${completeStudent.name}`);

const basicSchool = {
    school: "Samar State University",
    city: "Catbalogan"
};

const completeSchool = {
    ...basicSchool,
    campus: "Main Campus",
    semester: "First Semester"
};

console.log(`School Campus: ${completeSchool.campus}`);


// ---------- 2 ARRAYS USING MAP() ----------

const originalGrades = [90, 85, 95];

const increasedGrades = originalGrades.map(
    grade => grade + 2
);

console.log(`Increased Grades: ${increasedGrades}`);

const studentNames = ["Liza Mae", "Val", "Adrian"];

const upperNames = studentNames.map(
    name => name.toUpperCase()
);

console.log(`Uppercase Names: ${upperNames}`);


// ---------- 2 ARRAYS USING FILTER() ----------

const allGrades = [90, 65, 85, 70, 95];

const passingStudents = allGrades.filter(
    grade => grade >= passingGrade
);

console.log(`Passing Grades: ${passingStudents}`);

const allStudents = [
    { name: "Liza  Mae", grade: 90 },
    { name: "Val", grade: 65 },
    { name: "Adrian", grade: 95 }
];

const passedStudents = allStudents.filter(
    student => student.grade >= passingGrade
);

console.log(`Number of Passing Students: ${passedStudents.length}`);


// ---------- 2 OBJECT LITERALS USING OPTIONAL CHAINING ----------

const studentProfile = {
    name: "Liza Mae",
    address: {
        city: "Calbayog"
    }
};

const profileResult = {
    studentName: studentProfile?.name,
    studentCity: studentProfile?.address?.city
};

console.log(`Profile Name: ${profileResult.studentName}`);
console.log(`Profile City: ${profileResult.studentCity}`);


const courseProfile = {
    course: "Mobile Programming",
    instructor: {
        name: "Mr. Ortiz"
    }
};

const courseResult = {
    courseName: courseProfile?.course,
    instructorName: courseProfile?.instructor?.name
};

console.log(`Course Name: ${courseResult.courseName}`);
console.log(`Instructor: ${courseResult.instructorName}`);


// ---------- USING THE ARROW FUNCTIONS ----------

console.log(greetStudent(studentName));

console.log(
    getFullCourse(course)
);

console.log(
    displayStudent(studentName, studentID)
);

const average = getAverage(
    grade1,
    grade2,
    grade3
);

console.log(`Average Grade: ${average}`);

console.log(
    `Final Status: ${checkStatus(average)}`
);