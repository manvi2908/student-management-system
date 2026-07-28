import axios from "axios";

const BASE_URL = "https://dummyjson.com/users";

// GET API
export const getStudents = () => {
    return axios.get(BASE_URL);
};

// POST API
export const addStudent = (studentData) => {
    return axios.post(
        `${BASE_URL}/add`,
        studentData
    );
};

//Using PUT API
export const updateStudent = (id, studentData) => {
    return axios.put(
        `${BASE_URL}/${id}`,
        studentData
    );
};


// using PATCH API
export const verifyStudent = (id) => {
  return axios.patch(`${BASE_URL}/${id}`, {
    verified: true,
  });
};

// DELETE API
export const deleteStudent = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};