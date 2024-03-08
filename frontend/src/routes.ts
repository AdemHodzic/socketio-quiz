import { createRouter, createWebHistory } from 'vue-router';

import Debug from './pages/Debug.vue';

const routes = [
    { path: '/debug', component: Debug, name: 'debug' },
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router;
