<template>
    <div class="container">
        <h1>Main</h1>
        <button @click="logout">Log out</button>

        <button @click="this.gameStore.join">Join</button>
        <button @click="this.gameStore.leave">Leave</button>

        <pre v-if="gameStore.$state.match">{{ gameStore.$state.match }}</pre>
    </div>
</template>

<script>
import useGame from '../store/useGame'

import { mapStores } from 'pinia'


export default {
    computed: {
        ...mapStores(useGame),
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