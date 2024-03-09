import axios from "./axios";

export const login = async (username: string, password: string) => {
    const { token } =  await axios.post('/auth/login', { username, password }).then(res => res.data);

    localStorage.setItem('token', token);

    return token;
}

export const register = async (username: string, password: string) => {
    const { token } =  await axios.post('/auth/register', { username, password }).then(res => res.data);

    localStorage.setItem('token', token);

    return token;
}