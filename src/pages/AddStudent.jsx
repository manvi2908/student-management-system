import React, { useState, useEffect } from "react";
import StudentForm from "../components/StudentForm";
import { validateStudent } from "../utils/validation";

function AddStudent({ editingStudent, setEditingStudent, setShowForm, onStudentAdded }) {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() =>  {
        if(editingStudent){
          setFormData({
            firstName: editingStudent.firstName,
            lastName: editingStudent.lastName,
            email: editingStudent.email,
            phone: editingStudent.phone.replace(/\D/g, "").slice(-10),
            gender: editingStudent.gender,
            age: editingStudent.age,
          });
        } else{
          setFormData({
            firstName:"",
            lastName:"",
            email:"",
            phone:"",
            gender:"",
            age:""
          })
        }

  }, [editingStudent]);


const handleSubmit = async () => {

  const validationErrors = validateStudent(formData);

  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    return;
  }

  try {

    if (editingStudent) {

      // Update locally
      onStudentAdded({
        ...editingStudent,
        ...formData,
      });

      alert("Student Updated Successfully");

    } 
    else {
  
  onStudentAdded({
    ...formData,
    verificationStatus: "Pending",
  });

  alert("Student Added Successfully");

}

  } catch (error) {
    alert("Something went wrong");
  }
};


{/* Pass props to StudentForm component and responsible for rendering the UI*/}
  return (
    <StudentForm
  formData={formData}
  editingStudent={editingStudent}
  setFormData={setFormData}
  handleSubmit={handleSubmit}
  setShowForm={setShowForm}
  errors={errors}
  setErrors={setErrors}
/>
  );
}

export default AddStudent;