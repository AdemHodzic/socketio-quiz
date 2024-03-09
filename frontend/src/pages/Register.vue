<template>
    <div class="container">
        <h1>Register</h1>
        <form @submit.prevent="register">
            <div class="form-group">
                <label for="username">username</label>
                <input type="username" class="form-control" id="username" v-model="username">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" v-model="password">
            </div>
            <div class="form-group">
                <label for="repeat_password">Repeat Password</label>
                <input type="password" class="form-control" id="repeat_password" v-model="repeat_password">
            </div>
            
            <button type="submit" class="btn btn-primary" :disabled="username.length < 3 || password.length < 3 || password !== repeat_password">Register</button>
        </form>
        <router-link to="login">Already have an account?</router-link>
    </div>
</template>

<script>
import { register } from "../api"

export default {
    data() {
        return {
            username: '',
            password: '',
            repeat_password: '',
        }
    },
    methods: {
        async register() {

            try {
                const response = await register(this.username, this.password)
                console.log(response)
                this.$router.push('/')
            } catch (error) {
                console.error(error)
            }
        }
    }
}
</script>

<style>
</style>