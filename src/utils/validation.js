export const validateStudent = (formData) => {
  const errors = {};

  // ==========================
  // First Name
  // ==========================
  const firstName = String(formData.firstName || "").trim();

  if (!firstName) {
    errors.firstName = "First Name is required";
  } else if (firstName.length > 50) {
    errors.firstName = "Maximum 50 characters allowed";
  } else if (!/^[A-Za-z][A-Za-z\s'-]{0,49}$/.test(firstName)) {
    errors.firstName =
      "First name must start with a letter and contain only alphabets";
  }

  // ==========================
  // Last Name
  // ==========================
  const lastName = String(formData.lastName || "").trim();

  if (!lastName) {
    errors.lastName = "Last Name is required";
  } else if (lastName.length > 50) {
    errors.lastName = "Maximum 50 characters allowed";
  } else if (!/^[A-Za-z][A-Za-z\s'-]{0,49}$/.test(lastName)) {
    errors.lastName =
      "Last name must start with a letter and contain only alphabets";
  }

  // ==========================
  // Email
  // ==========================
  const email = String(formData.email || "").trim();

  if (!email) {
    errors.email = "Email is required";
  } else if (
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
  ) {
    errors.email = "Enter a valid email address";
  }

  // ==========================
  // Phone
  // ==========================
  const phone = String(formData.phone || "").trim();

  if (!phone) {
    errors.phone = "Phone Number is required";
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = "Phone Number must contain exactly 10 digits";
  }

  // ==========================
  // Age
  // ==========================
  const age = Number(formData.age);

  if (formData.age === "" || formData.age === null || formData.age === undefined) {
    errors.age = "Age is required";
  } else if (isNaN(age)) {
    errors.age = "Age must be a valid number";
  } else if (age < 18 || age > 100) {
    errors.age = "Age should be between 18 and 100";
  }

  // ==========================
  // Gender
  // ==========================
  if (!formData.gender) {
    errors.gender = "Please select gender";
  }

  return errors;
};