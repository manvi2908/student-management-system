export const validateStudent = (formData) => {
  const errors = {};

  // ==========================
  // First Name
  // ==========================
  if (!formData.firstName.trim()) {
    errors.firstName = "First Name is required";
  } else if (formData.firstName.length > 50) {
    errors.firstName = "Maximum 50 characters allowed";
  } else if (!/^[A-Za-z][A-Za-z\s'-]{0,49}$/.test(formData.firstName)) {
    errors.firstName =
      "First name must start with a letter and contain only alphabets";
  }

  // ==========================
  // Last Name
  // ==========================
  if (!formData.lastName.trim()) {
    errors.lastName = "Last Name is required";
  } else if (formData.lastName.length > 50) {
    errors.lastName = "Maximum 50 characters allowed";
  } else if (!/^[A-Za-z][A-Za-z\s'-]{0,49}$/.test(formData.lastName)) {
    errors.lastName =
      "Last name must start with a letter and contain only alphabets";
  }

  // ==========================
  // Email
  // ==========================
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
  ) {
    errors.email = "Enter a valid email address";
  }

  // ==========================
  // Phone
  // ==========================
  if (!formData.phone.trim()) {
    errors.phone = "Phone Number is required";
  } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
    errors.phone = "Phone Number must contain exactly 10 digits";
  }

  // ==========================
  // Age
  // ==========================
  if (!formData.age) {
    errors.age = "Age is required";
  } else if (formData.age < 18 || formData.age > 60) {
    errors.age = "Age should be between 18 and 60";
  }

  // ==========================
  // Gender
  // ==========================
  if (!formData.gender) {
    errors.gender = "Please select gender";
  }

  return errors;
};