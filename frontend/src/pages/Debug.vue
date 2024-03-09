<template>
    <div>
        <h1>Debug</h1>
        <div class="input-container">
            <input type="text" v-model="jwt" placeholder="jwt" />
            <input type="text" v-model="event"  placeholder="event"/>
            <input type="text" v-model="payload" placeholder="payload"/>
        </div>
    </div>
</template>

<script>

import io from 'socket.io-client';

export default {
    data() {
        return {
            jwt: '',
            event: '',
            payload: '',
            socket: null,
        }
    },
    mounted() {
        this.socket = io('http://localhost:3000');
    },
}
</script>

<style>
.input-container {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    gap: 1.25rem;
}
</style>