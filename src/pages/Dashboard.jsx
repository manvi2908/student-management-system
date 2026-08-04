// ==============================
// Import Required Libraries
// ==============================
import React, { useEffect, useState, useRef } from "react";

// Import Components
import Navbar from "../components/Navbar";
//import StudentForm from "../components/StudentForm";
import AddStudent from "./AddStudent";
import StatsCard from "../components/StatsCard";
import {
  exportToCSV,
  exportToExcel,
} from "../utils/exportUtility";

import { importStudents } from "../utils/importUtility";
import { validateStudent } from "../utils/validation";

function Dashboard() {

  // ==============================
  // State Variables
  // ==============================

  // Stores all students fetched from backend
  const [students, setStudents] = useState([]); //no students are loaded.

  // Stores text entered inside Search Bar
  const [searchTerm, setSearchTerm] = useState("");
  // to show form
  const [showForm, setShowForm] = useState(false);
  // show actions of export, import and add student 
  const [showMenu, setShowMenu] = useState(false);
  // export pop up ke liye 
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef(null);
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
  const validStudents = students.filter(
    (student) => student.age !== undefined && student.age !== null && student.age !== ""
  );

  const averageAge =
    validStudents.length > 0
      ? (
        validStudents.reduce(
          (sum, student) => sum + Number(student.age || 0),
          0
        ) / validStudents.length
      ).toFixed(1)
      : "0";

  const maxAge =
    students.length > 0
      ? Math.max(
        ...students.map((student) => Number(student.age || 0))
      )
      : 0;

  const minAge = Math.min(
    ...students.map(student => Number(student.age))
  );

  const verifiedStudents = students.filter(
    student => student.verificationStatus === "Verified"
  ).length;

  const unverifiedStudents =
    students.length - verifiedStudents;

  // ==============================
  // Fetch Students from Backend
  // Runs only once when page loads
  // ==============================

useEffect(() => {

  const savedStudents = localStorage.getItem("students");

  if (savedStudents) {

    setStudents(JSON.parse(savedStudents)); // string to array or object

  }

}, []);

  // another useEffect for saved changes on local storage permanently after performing any operation 
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("students", JSON.stringify(students)); // data convert to string because local storage can only store string data.
    }
  }, [students]);


  // ==============================
  // Search Logic
  // Filter students according to
  // search input
  // ==============================
  // Filter Student
  const [genderFilter, setGenderFilter] = useState("");
// to apply filter and search together we will use this filteredStudents variable to store the filtered data.
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
// to apply gender filter
    const matchesGender = genderFilter === "" || genderFilter === "all" || student.gender === genderFilter;
    return matchesGender && matchesSearch;
  });

  const [sortBy, setSortBy] = useState("");

  const sortedStudents = [...filteredStudents]; // copy array because .sort() only modify the original array and react state should never be modified directly.
  if (sortBy === "name-asc") {
    sortedStudents.sort((a, b) => a.firstName.localeCompare(b.firstName));
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
  {/*const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(""); Currently not being used. */} 


  const getNextStudentId = (students) => {

  const ids = students
    .map(student => Number(student.id)) // only return IDs and convert to number because some ids are string and some are number.
    .filter(id => !isNaN(id)) // filter out invalid IDs
    .sort((a, b) => a - b); // sort in ascending order

  let nextId = 1;

  for (const id of ids) {

    if (id === nextId) {
      nextId++;
    } else {
      break;
    }

  }

  return nextId;

};

  const handleStudentAdded = (student) => {

  setStudents((prevStudents) => {

    const updatedStudent = {
      ...student, // copies all fields from student object

      id: editingStudent
        ? editingStudent.id
        : getNextStudentId(prevStudents),

      verificationStatus:
        student.verificationStatus || "Pending",
    };

    let updatedStudents; // store final array of students after adding or editing a student.

    if (editingStudent) {

      updatedStudents = prevStudents.map((s) =>
        s.id === editingStudent.id
          ? updatedStudent
          : s
      );

    } else {

      updatedStudents = [
        updatedStudent, // updated student appears on top of the list
        ...prevStudents, // existing students are added after the new student
      ];

    }

    return updatedStudents;

  });

  setEditingStudent(null);
  setShowForm(false);
  setCurrentPage(1);  // return to the first page to see the updated or newly added student.
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
 const handleDeleteStudent = (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this student?"
  );

  if (!confirmDelete) return; // if user presses cancel func. stops immediately.

  setStudents((prevStudents) => {
    // Remove selected student
    const filteredStudents = prevStudents.filter(
      (student) => student.id !== id
    );

    // Reassign IDs
    const updatedStudents = filteredStudents.map((student, index) => ({
      ...student,
      id: index + 1,
    }));

    return updatedStudents;
  });

  alert("Student deleted successfully!");
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


  const handleImportStudents = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    try {

      const importedStudents = await importStudents(file);
      const formattedStudents = importedStudents.map((row) => ({
        id: row.id || row.ID,
        firstName: row.firstName || row["First Name"],
        lastName: row.lastName || row["Last Name"],
        email: row.email || row.Email,
        phone: row.phone || row.Phone,
        age: row.age || row.Age,
        gender: row.gender || row.Gender,
        verificationStatus: (
          row.verificationStatus ||
          row["Verification Status"] ||
          "Pending"
        )
          .toString()
          .trim()
          .toLowerCase(),
      }));

     setStudents((prevStudents) => {

  const mergedStudents = [...prevStudents];

  let importedCount = 0;
  let duplicateCount = 0;
  let invalidCount = 0;

  formattedStudents.forEach((student) => {

    // ==========================
    // Clean imported data
    // ==========================
    const formattedStudent = {
  firstName: String(student.firstName || "").trim(),
  lastName: String(student.lastName || "").trim(),
  email: String(student.email || "").trim(),
  phone: String(student.phone || "").replace(/\D/g, ""),
  age: Number(student.age),
  gender: String(student.gender || "").trim().toLowerCase(),
};

    // ==========================
    // Validation
    // ==========================
    const validationErrors = validateStudent(formattedStudent);

    if (Object.keys(validationErrors).length > 0) {
      invalidCount++;
      return;
    }

    // ==========================
    // Duplicate Check
    // ==========================
    const isDuplicate = mergedStudents.some(
      (existingStudent) =>
        existingStudent.email.toLowerCase() ===
          formattedStudent.email.toLowerCase() ||
        String(existingStudent.phone) ===
          String(formattedStudent.phone)
    );

    if (isDuplicate) {
      duplicateCount++;
      return;
    }

    // ==========================
    // Add Student
    // ==========================
    mergedStudents.push({
      ...formattedStudent,
      id: getNextStudentId(mergedStudents),
      verificationStatus: "Pending",
    });

    importedCount++;

  });

  localStorage.setItem(
    "students",
    JSON.stringify(mergedStudents)
  );

  // ==========================
  // Import Summary
  // ==========================
  let message = "";

  if (importedCount > 0)
    message += `✅ ${importedCount} student(s) imported successfully.\n`;

  if (duplicateCount > 0)
    message += `⚠️ ${duplicateCount} duplicate student(s) skipped.\n`;

  if (invalidCount > 0)
    message += `❌ ${invalidCount} invalid student(s) skipped.\n`;

  if (
    importedCount === 0 &&
    duplicateCount === 0 &&
    invalidCount === 0
  ) {
    message = "No records found.";
  }

  alert(message);

  return mergedStudents;

    });
  } catch (error) {
    alert("Failed to import students. Please check the file format.");
  }};

  return (
    <>

      {/* Navbar */}
      <Navbar />

      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImportStudents}
      />

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
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
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
        <div className="flex justify-end mb-6 relative">

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-300"
          >
            Actions ▼
          </button>

          {showMenu && (
            <div className="absolute top-12 right-0 w-56 bg-white rounded-lg shadow-lg border z-50">

              {/* Add Student */}

              <button
                onClick={() => {
                  setEditingStudent(null);
                  setShowForm(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                ➕ Add Student
              </button>

              {/* Export */}

              <button
                onClick={() => {
                  setShowExportModal(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                📤 Export Data
              </button>

              {/* Import */}

              <button
                onClick={() => {
                  setShowImportModal(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                📥 Import Data
              </button>

            </div>
          )}

        </div>

        {
          showForm &&  // this && is called conditional rendering. If showForm is true then only the below component will be rendered otherwise not.
          (<AddStudent
            setShowForm={setShowForm}
            onStudentAdded={handleStudentAdded}
            editingStudent={editingStudent}
            setEditingStudent={setEditingStudent} />)

        }

        {/* Student List Heading */}

        <h2 className="text-2xl font-medium mb-5 bg-orange-500 rounded p-2">
          STUDENT LIST
        </h2>

        {/* Student Cards */}

        {currentStudents.length > 0 ? ( // check whether students exists or not.

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
                      className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${student.verificationStatus?.toLowerCase() === "verified"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {student.verificationStatus
                        ? student.verificationStatus.charAt(0).toUpperCase() +
                        student.verificationStatus.slice(1).toLowerCase()
                        : "Pending"}
                    </span>
                  </p>
                </div>

                <hr className="my-4" />

                <div className="flex justify-center">
                  <button
                    onClick={() => handleVerifyStudent(student.id)}
                    disabled={student.verificationStatus === "Verified"}
                    className={`px-5 py-2 rounded-lg font-semibold transition ${student.verificationStatus === "Verified"
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

        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl p-6 w-96 shadow-xl">

              <h2 className="text-2xl font-bold mb-4">
                Export Data
              </h2>

              <p className="mb-4 text-gray-600">
                Choose File Format
              </p>

              <div className="space-y-3">

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="export"
                    value="csv"
                    checked={exportFormat === "csv"}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  CSV
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="export"
                    value="excel"
                    checked={exportFormat === "excel"}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  Excel
                </label>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {

                    if (exportFormat === "csv") {

                      exportToCSV(students);
                      alert("CSV file exported successfully!");

                    } else {

                      exportToExcel(students);
                      alert("Excel file exported successfully!");

                    }

                    setShowExportModal(false);

                  }}
                >
                  Export
                </button>

              </div>

            </div>

          </div>
        )}
      </div>

      {/* ================= Import Modal ================= */}

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">

            <h2 className="text-2xl font-bold mb-4">
              Import Data
            </h2>

            <p className="mb-4 text-gray-600">
              Choose a CSV or Excel file
            </p>

            <div className="mb-5">

              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full border rounded-lg py-3 bg-gray-100 hover:bg-gray-200"
              >
                Choose File
              </button>

            </div>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  fileInputRef.current.click();
                  setShowImportModal(false);
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Import
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}


export default Dashboard;