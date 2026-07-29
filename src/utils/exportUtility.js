import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ==========================
// Export CSV
// ==========================

export const exportToCSV = (students) => {

  if (!students.length) {
    alert("No student data available!");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(students);

  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "students.csv");

};


// ==========================
// Export Excel
// ==========================

export const exportToExcel = (students) => {

  if (!students.length) {
    alert("No student data available!");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(students);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Students"
  );

  XLSX.writeFile(
    workbook,
    "students.xlsx"
  );

};