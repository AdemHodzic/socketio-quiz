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
    return await axios.get('/auth/me').then(res => res.data);
}

export const stats = async () => {
    return await axios.get('/auth/stats').then(res => res.data);
}

// Game

export const join = async () => {
    const match  = await axios.post('/game/join').then(res => res.data);
    return match;
}

export const results = async (matchId: string) => {
    return await axios.get(`/game/results/${matchId}`).then(res => res.data);

}

// Questions

export const getQuestions = async () => {
    return await axios.get('/admin/questions').then(res => res.data);
}

export const getQuestion = async (id: string) => {
    return await axios.get(`/admin/questions/${id}`).then(res => res.data);
}

export const createQuestions = async (questions: any) => {
    return await axios.post('/admin/questions', questions);
}

export const updateQuestions = async (questions: any) => {
    return await axios.patch('/admin/questions', questions);
}

export const deleteQuestions = async (ids: string[]) => {
    return await axios.delete('/admin/questions', { data: { ids } });
}

export default {
    login,
    register,
    me,
    stats,
    
    join,
    results,

    getQuestions,
    getQuestion,
    createQuestions,
    updateQuestions,
    deleteQuestions,
}