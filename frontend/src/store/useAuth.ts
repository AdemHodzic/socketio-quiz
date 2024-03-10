
import { defineStore } from 'pinia'

import api from '../api'
import router from "../routes";

const useAuth = defineStore('auth', {
    state: () => ({ user: null as any | null }),
    actions: {
        async login(username: string, password: string) {
            const token = await api.login(username, password);
            console.log(token)
            localStorage.setItem('token', token);
            await this.me();
            router.push({ name: 'main' })
        },
        async register(username: string, password: string) {
            const token = await api.register(username, password);
            localStorage.setItem('token', token);
            await this.me();
            router.push({ name: 'main' })
        },
        async me() {
            const user = await api.me();
            this.user = user;
        },
        logout() {
            this.user = null;
            localStorage.removeItem('token');
            router.push({ name: 'login' })
        }
    }
});

export default useAuth;