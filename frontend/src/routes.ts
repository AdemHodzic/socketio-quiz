import { createRouter, createWebHistory } from 'vue-router';

import Debug from './pages/Debug.vue';
import Game from './pages/Game.vue';
import Login from './pages/Login.vue';
import Main from './pages/Main.vue';
import Register from './pages/Register.vue';
import Results from './pages/Results.vue';

const routes = [
    { path: '/debug', component: Debug, name: 'debug' },
    { path: '/game', component: Game, name: 'game' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/main', component: Main, name: 'main' },
    { path: '/register', component: Register, name: 'register' },
    { path: '/results', component: Results, name: 'results' },
    { path: '/', redirect: '/main' }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

// TODO: remove debug later
const noAuthRoutes = ['login', 'register', 'debug'];

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    if (!noAuthRoutes.includes(String(to.name)) && !isAuthenticated) next({ name: 'login' })
    else next()
  })

export default router;
