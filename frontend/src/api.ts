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

// Questions

export const getQuestions = async () => {
    return await axios.get('/admin/questions').then(res => res.data);
}

export const createQuestions = async (questions: any) => {
    return await axios.post('/admin/questions', questions);
}

export const updateQuestions = async (questions: any) => {
    return await axios.put('/admin/questions', questions);
}

export const deleteQuestions = async (ids: string[]) => {
    return await axios.delete('/admin/questions', { data: { ids } });
}

export default {
    login,
    register,
    me,
    join,

    getQuestions,
    createQuestions,
    updateQuestions,
    deleteQuestions,
}