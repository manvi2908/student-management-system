// ==============================
// Import Required Libraries
// ==============================
import React, { useEffect, useState } from "react";

// Import API Function
import { getStudents, verifyStudent, deleteStudent} from "../services/studentServices";


// Import Components
import Navbar from "../components/Navbar";
//import StudentForm from "../components/StudentForm";
import AddStudent from "./AddStudent";
import StatsCard from "../components/StatsCard";

function Dashboard() {

  // ==============================
  // State Variables
  // ==============================

  // Stores all students fetched from backend
  const [students, setStudents] = useState([]);

  // Stores text entered inside Search Bar
  const [searchTerm, setSearchTerm] = useState("");
  // to show form
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 6;
  
  // Store the detail of students after clicking on edit 
  const [editingStudent, setEditingStudent] = useState(null); //why is this null because here we are adding the student.
  
  // ==============================
  // Dashboard Statistics
  // ==============================

  // Total Students
  const totalStudents = students.length;

  // Total Male Students
  const maleStudents = students.filter(
    (student) => student.gender === "male"
  ).length;

  // Total Female Students
  const femaleStudents = students.filter(
    (student) => student.gender === "female"
  ).length;

  // Calculate Average Age
  const averageAge =
  students.length > 0
    ? (
        students.reduce(
          (sum, student) => sum + Number(student.age),
          0
        ) / students.length
      ).toFixed(1)
    : 0;

    const maxAge = Math.max(
  ...students.map(student => Number(student.age))
);

const minAge = Math.min(
  ...students.map(student => Number(student.age))
);

const verifiedStudents = students.filter(
    student => student.verified
).length;

const unverifiedStudents =
students.length - verifiedStudents;

  // ==============================
  // Fetch Students from Backend
  // Runs only once when page loads
  // ==============================

  useEffect(() => {

  // Check if students already exist in Local Storage
  const savedStudents = localStorage.getItem("students");

  if (savedStudents) {

    // Load students from Local Storage
    setStudents(JSON.parse(savedStudents));

  } else {

    // First time: Fetch from DummyJSON
    getStudents()
      .then((response) => {

        setStudents(response.data.users);

        // Save API data into Local Storage
        localStorage.setItem(
          "students",
          JSON.stringify(response.data.users)
        );

      })
      .catch(() => {

      });

  }

}, []);


// another useEffect for saved changes on local storage permanently after performing any operation 
useEffect(() =>{
  if(students.length>0) 
  {
    localStorage.setItem("students",JSON.stringify(students));
  }
}, [students]);


  // ==============================
  // Search Logic
  // Filter students according to
  // search input
  // ==============================
// Filter Student
  const [genderFilter, setGenderFilter] = useState("");

  const filteredStudents = students.filter((student) =>{
    const matchesSearch = 
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === "" || genderFilter === "all" || student.gender === genderFilter;
    return matchesGender && matchesSearch;  
  });

  const [sortBy, setSortBy] = useState("");

  const sortedStudents = [...filteredStudents];
  if(sortBy === "name-asc"){
    sortedStudents.sort((a,b) => a.firstName.localeCompare(b.firstName));
  }
  if (sortBy === "name-desc") {

  sortedStudents.sort((a, b) =>
    b.firstName.localeCompare(a.firstName)
  );

}

if (sortBy === "age-asc") {

  sortedStudents.sort((a, b) =>
    a.age - b.age
  );

}

if (sortBy === "age-desc") {

  sortedStudents.sort((a, b) =>
    b.age - a.age
  );

}
const indexOfLastStudent = currentPage * studentsPerPage;
const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);
const totalPages = Math.ceil(
  sortedStudents.length / studentsPerPage
);
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const handleStudentAdded = (student) => {
  const updatedStudent = {
    ...student,
    id: student?.id ?? editingStudent?.id,
  };

  if (editingStudent) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === editingStudent.id
          ? { ...s, ...updatedStudent }
          : s
      )
    );
  } else {
    setStudents((prev) => [updatedStudent, ...prev]);
  }

  setEditingStudent(null);
  setShowForm(false);
};

const handleResetFilters = () => {
  setSearchTerm("");
  setGenderFilter("");
  setSortBy("");
}
  // ==============================
  // UI Starts Here
  // ==============================

   // to delete student details
  const handleDeleteStudent = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this student?"
  );

  if (!confirmDelete) return;

  try {

    await deleteStudent(id);

    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    );

    alert("Student deleted successfully!");

  } catch (error) {

    alert("Failed to delete student.");

  }

};

  const handleVerifyStudent = (id) => {

  setStudents((prevStudents) =>
    prevStudents.map((student) =>
      student.id === id
        ? {
            ...student,
            verificationStatus: "Verified",
          }
        : student
    )
  );

  alert("Student Verified Successfully!");

};
  return (
    <>

      {/* Navbar */}
      <Navbar />

      <div className="p-5 bg-gray-100 min-h-screen">

        {/* Dashboard Heading */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard
        </h2>



        {/* Statistics Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <StatsCard
            title="Total Students"
            value={totalStudents}
            color="border-blue-500"
          />

          <StatsCard
            title="Male Students"
            value={maleStudents}
            color="border-green-500"
          />

          <StatsCard
            title="Female Students"
            value={femaleStudents}
            color="border-pink-500"
          />

          <StatsCard
            title="Average Age"
            value={averageAge}
            color="border-yellow-500"
          />

          <StatsCard
  title="Maximum Age"
  value={maxAge}
  color="border-purple-500"
/>

<StatsCard
  title="Minimum Age"
  value={minAge}
  color="border-orange-500"
/>

<StatsCard
  title="Verified Students"
  value={verifiedStudents}
  color="border-green-500"
/>

<StatsCard
  title="Pending Verification"
  value={unverifiedStudents}
  color="border-red-500"
/>

        </div>

        {/* Search Bar */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

          <input
            type="text"
            placeholder="🔍 Search student by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

         {/*  Gender filter  */} 
         <select 
    value={genderFilter}
    onChange={(e) => setGenderFilter(e.target.value)}
    className="border rounded-sm px-2 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="" disabled> 👤 Gender </option>
    <option value="all">All Students</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
  </select>
          {/* Sort Filter */}
          <select value = {sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled> ↕ Sort By </option>
              <option value="name-asc">Name (A-z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="age-asc">Age (Low-High)</option>
              <option value="age-desc">Age (High-Low)</option>
            </select>
            <button
      onClick={handleResetFilters}
      className="px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm transition"
    >
      🔄 Reset
    </button>
        </div>
        {/*            Student Form            */}
        <div className="flex justify-end mb-6">
          <button onClick={() => { setEditingStudent(null); setShowForm(true);

}}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow trasition duration-300">
              + Add Student
            </button>
        </div>

{
  showForm &&
  (<AddStudent
        setShowForm ={setShowForm}
        onStudentAdded={handleStudentAdded}
        editingStudent={editingStudent}
        setEditingStudent={setEditingStudent}/>)
  
}

        {/* Student List Heading */}

        <h2 className="text-2xl font-medium mb-5 bg-orange-500 rounded p-2">
          STUDENT LIST
        </h2>

        {/* Student Cards */}

        {currentStudents.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {currentStudents.map((student) => (

              <div
                key={student.id}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition duration-300"
              >

                <div className="flex justify-between items-center">

    <h3 className="text-xl font-bold text-blue-700">
        {student.firstName} {student.lastName}
    </h3>
        {/* Edit button */}
        <div className="p-3 ">
    <button
        onClick={() => {
            setEditingStudent(student);
            setShowForm(true);
        }}
        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
    >
        ✏ 
    </button>

        {/* Delete button */}

      <button
  onClick={() => handleDeleteStudent(student.id)}
  className="text-2xl hover:scale-125 text-sm transition-transform duration-200"
>
  🗑️
</button>  </div>

</div>
                <p className="text-gray-600 mt-2">
                  📧 {student.email}
                </p>

                <p className="text-gray-600">
                  👤 {student.gender}
                </p>

                <p className="text-gray-600">
                  🎂 {student.age} Years
                </p>

                <p className="text-gray-600">
                  📞 {student.phone}
                </p>

                <div className="mt-4">
  <p className="font-semibold">
    Status :
    <span
      className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
        student.verificationStatus === "Verified"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {student.verificationStatus || "Pending"}
    </span>
  </p>
</div>

<hr className="my-4" />

<div className="flex justify-center">
  <button
    onClick={() => handleVerifyStudent(student.id)}
    disabled={student.verificationStatus === "Verified"}
    className={`px-5 py-2 rounded-lg font-semibold transition ${
      student.verificationStatus === "Verified"
        ? "bg-green-600 text-white cursor-not-allowed"
        : "bg-yellow-500 hover:bg-yellow-600 text-white"
    }`}
  >
    {student.verificationStatus === "Verified"
      ? "Verified"
      : "Verify Student"}
  </button>
</div>

              </div>

            ))}

            <div className="flex justify-end items-center gap-3 mt-6 text-sm">

  <button
    onClick={() => setCurrentPage(currentPage - 1)}
    disabled={currentPage === 1}
    className="px-3 py-1 border border-gray-300 rounded-md bg-blue-500 text-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    ◀ Prev
  </button>

  <span className="text-gray-600 font-medium">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="px-3 py-1 border border-blue-500 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Next ▶
  </button>

</div>

          </div>

        ) : (

          <p className="text-center text-red-500 text-lg mt-10">
            No student found.
          </p>

        )}

      </div>

    </>
  );
}

export default Dashboard;