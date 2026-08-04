import React from "react";

function StudentForm({
  formData,
  editingStudent,
  setFormData,
  handleSubmit,
  setShowForm,
  errors,
  setErrors,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">

      {/* Popup */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* ================= Header ================= */}

     {/* Conditional ClassName */}
        <div
  className={`px-6 py-5
  ${
    editingStudent
      ? "bg-gradient-to-r from-green-600 to-emerald-600"
      : "bg-gradient-to-r from-blue-600 to-indigo-600"
  }`}
> 

          <h2 className="text-2xl font-bold text-white">
  {editingStudent
    ? "Update Student Details"
    : "Add New Student"}
</h2>

          <p className="text-blue-100 text-sm mt-1">
  {editingStudent
    ? "Modify the student's information and save the changes."
    : "Fill in the student's information below."}
</p>

        </div>

        {/* ================= Form ================= */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >

          {/* Scrollable Body */}

          <div className="p-6 ">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* First Name */}

             <div>
  <label className="block text-sm font-semibold mb-2">
    First Name
  </label>

  <input
    type="text"
    placeholder="Enter First Name"
    value={formData.firstName}
    onChange={(e) =>
      setFormData({
        ...formData,
        firstName: e.target.value,
      })
    }
    className={`w-full rounded-lg px-4 py-3 outline-none
      ${
        errors.firstName
          ? "border-2 border-red-500"
          : "border border-gray-300 focus:ring-2 focus:ring-blue-500"
      }`}
  />

  {errors.firstName && (
    <p className="text-red-500 text-sm mt-1">
      {errors.firstName}
    </p>
  )}
</div>

              {/* Last Name */}

              <div>
  <label className="block text-sm font-semibold mb-2">
    Last Name
  </label>

  <input
    type="text"
    placeholder="Enter Last Name"
    value={formData.lastName}
    onChange={(e) =>
      setFormData({
        ...formData,
        lastName: e.target.value,
      })
    }
    className={`w-full rounded-lg px-4 py-3 outline-none
      ${
        errors.lastName
          ? "border-2 border-red-500"
          : "border border-gray-300 focus:ring-2 focus:ring-blue-500"
      }`}
  />

  {errors.lastName && (
    <p className="text-red-500 text-sm mt-1">
      {errors.lastName}
    </p>
  )}
</div>

              {/* Email */}

              <div className="md:col-span-2">
  <label className="block text-sm font-semibold mb-2">
    Email
  </label>

  <input
    type="email"
    placeholder="Enter Email"
    value={formData.email}
    onChange={(e) =>
      setFormData({
        ...formData,
        email: e.target.value,
      })
    }
    className={`w-full rounded-lg px-4 py-3 outline-none
      ${
        errors.email
          ? "border-2 border-red-500"
          : "border border-gray-300 focus:ring-2 focus:ring-blue-500"
      }`}
  />

  {errors.email && (
    <p className="text-red-500 text-sm mt-1">
      {errors.email}
    </p>
  )}
</div>

              {/* Phone */}

              <div>
  <label className="block text-sm font-semibold mb-2">
    Phone
  </label>

  <input
    type="text"
    placeholder="Enter Phone Number"
    value={formData.phone}
    onChange={(e) =>
      setFormData({
        ...formData,
        phone: e.target.value,
      })
    }
    className={`w-full rounded-lg px-4 py-3 outline-none
      ${
        errors.phone
          ? "border-2 border-red-500"
          : "border border-gray-300 focus:ring-2 focus:ring-blue-500"
      }`}
  />

  {errors.phone && (
    <p className="text-red-500 text-sm mt-1">
      {errors.phone}
    </p>
  )}
</div>

              {/* Age */}

              <div>
  <label className="block text-sm font-semibold mb-2">
    Age
  </label>

  <input
    type="number"
    placeholder="Enter Age"
    value={formData.age}
    onChange={(e) =>
      setFormData({
        ...formData,
        age: e.target.value,
      })
    }
    className={`w-full rounded-lg px-4 py-3 outline-none
      ${
        errors.age
          ? "border-2 border-red-500"
          : "border border-gray-300 focus:ring-2 focus:ring-blue-500"
      }`}
  />

  {errors.age && (
    <p className="text-red-500 text-sm mt-1">
      {errors.age}
    </p>
  )}
</div>

              {/* Gender */}

              <div className="md:col-span-2">

  <label className="block text-sm font-semibold mb-3">
    Gender
  </label>

  <div className="flex gap-8">

    <label className="flex items-center gap-2">

      <input
        type="radio"
        value="male"
        checked={formData.gender === "male"}
        onChange={(e)=>
          setFormData({
            ...formData,
            gender:e.target.value
          })
        }
      />

      Male

    </label>

    <label className="flex items-center gap-2">

      <input
        type="radio"
        value="female"
        checked={formData.gender==="female"}
        onChange={(e)=>
          setFormData({
            ...formData,
            gender:e.target.value
          })
        }
      />

      Female

    </label>

  </div>

  {errors.gender && (
    <p className="text-red-500 text-sm mt-2">
      {errors.gender}
    </p>
  )}


              </div>

            </div>

          </div>

          {/* ================= Footer ================= */}

          <div className="bg-white px-6 py-4 flex justify-end gap-3">

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
            >
              Cancel
            </button>

            <button
  type="submit"
  className={`px-5 py-2 rounded-lg text-white font-semibold shadow-md transition
  ${
    editingStudent
      ? "bg-green-600 hover:bg-green-700"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {editingStudent ? "Update Student" : "Save Student"}
</button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default StudentForm;