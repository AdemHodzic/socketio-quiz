import axios from "./axios";

// Auth
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

export const me = async () => {
    const user = await axios.get('/auth/me').then(res => res.data);
    return user;
}

// Game

export const join = async () => {
    const match  = await axios.post('/game/join').then(res => res.data);
    return match;
}

export default {
    login,
    register,
    me,
    join,
}