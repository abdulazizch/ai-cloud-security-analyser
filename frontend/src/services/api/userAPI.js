import axios from './axios'

export const loginUser = async (payload) => {
    return await axios.post('/users/login', payload);
};
export const getUserData = async (userId) => {
    return await axios.get(`/users/getUserData/${userId}`);
};
export const registerUser = async (payload) => {
    return await axios.post("/users/registerUser", payload);
};
