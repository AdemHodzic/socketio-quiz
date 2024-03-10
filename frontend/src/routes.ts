import { createRouter, createWebHistory } from 'vue-router';

import Game from './pages/Game.vue';
import Login from './pages/Login.vue';
import Main from './pages/Main.vue';
import Register from './pages/Register.vue';
import Results from './pages/Results.vue';
import Stats from './pages/Stats.vue';
import Admin from './pages/Admin.vue';
import EditQuestion from './pages/EditQuestion.vue';
import AddQuestion from './pages/AddQuestion.vue';

import useAuth from './store/useAuth';
import useGame from './store/useGame';

const routes = [
    { path: '/game', component: Game, name: 'game' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/main', component: Main, name: 'main' },
    { path: '/register', component: Register, name: 'register' },
    { path: '/results/:matchId', component: Results, name: 'results' },
    { path: '/admin/question/new', component: AddQuestion, name: 'new-question' },
    { path: '/admin/question/:id', component: EditQuestion, name: 'edit-question' },
    { path: '/admin', component: Admin, name: 'admin' },
    { path: '/stats', component: Stats, name: 'stats' },
    { path: '/', redirect: '/main' }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

const noAuthRoutes = ['login', 'register'];

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    const authStore = useAuth();

    if (!noAuthRoutes.includes(String(to.name)) && !isAuthenticated) { 
        next({ name: 'login' })
    } else if (authStore.user === null && isAuthenticated) {
        authStore.me().then(() => next())
    }
    else next()
  })

router.beforeEach((to, from, next) => {
    if (from.name === 'game' && to.name === 'main') {
        const gameStore = useGame();
        gameStore.leave();
    }

    next();
})

export default router;
