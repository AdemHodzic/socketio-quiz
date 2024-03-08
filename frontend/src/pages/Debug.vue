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
export default {
    data() {
        return {
            jwt: '',
            event: '',
            payload: ''
        }
    }
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