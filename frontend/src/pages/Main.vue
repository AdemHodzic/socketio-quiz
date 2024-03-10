<template>
    <div class="container">
        <h1>Main</h1>

        <template v-if="authStore.isAdmin">
            <router-link to="admin">Admin Panel</router-link>
            <br>
        </template>

        <button @click="logout">Log out</button>

        <button @click="this.gameStore.join">Join</button>
        <button @click="this.gameStore.leave">Leave</button>

        <pre v-if="gameStore.$state.match">{{ gameStore.$state.match }}</pre>
    </div>
</template>

<script>
import useGame from '../store/useGame'
import useAuth from '../store/useAuth'
import { mapStores } from 'pinia'


export default {
    computed: {
        ...mapStores(useGame),
        ...mapStores(useAuth),
    },
    methods: {
        logout() {
            localStorage.removeItem('token')
            this.$router.push('/login')
        },
    }
}

</script>

<style>
</style>