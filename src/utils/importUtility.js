import * as XLSX from "xlsx";

export const importStudents = (file) => {
  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = (e) => {

      const data = e.target.result;

      const workbook = XLSX.read(data, {
        type: "binary",
      });

      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      resolve(jsonData);

    };

    reader.onerror = () => reject("Unable to read file.");

    reader.readAsBinaryString(file);

  });
};