<template>
    <div class="container">
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="username">username</label>
                <input type="username" class="form-control" id="username" v-model="username">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" v-model="password">
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <router-link to="register">Create an account</router-link>
    </div>

</template>

<script>

import { login } from "../api"

export default {
    data() {
        return {
            username: '',
            password: '',
        }
    },
    methods: {
        async login() {

            try {
                const response = await login(this.username, this.password)
                console.log(response)
                this.$router.push('/')
            } catch (error) {
                // TODO: add toast messages
                console.error(error)
            }
        }
    }
}
</script>

<style>
</style>