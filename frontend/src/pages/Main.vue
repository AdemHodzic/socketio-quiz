<template>
    <div class="container">
        <h1>Main</h1>
        <button @click="logout">Log out</button>
    </div>
</template>

<script>

export default {
    methods: {
        logout() {
            localStorage.removeItem('token')
            this.$router.push('/login')
        }
    }
}

</script>

<style>
</style>