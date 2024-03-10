<template>
    <div class="container">
        <h1>Game</h1>
        <router-link :to="{'name': 'main'}">Go to main menu</router-link>
        <div v-if="gameStore.question" class="question-container">
            <h2>{{ gameStore.question.body }}</h2>

            <h4 v-if="gameStore.feedback !== null" :style="{'color': gameStore.feedback ? 'green' : 'red'}">{{ gameStore.feedback ? "Correct Answer" : "Incorrect answer"  }}</h4>

            <div class="answers-container">
                <div v-for="answer in gameStore.question.answers" :key="answer.id" >
                    <button @click="gameStore.answer(answer.id)" :style="{'color': answer.is_correct ? 'green' : 'red'}" :disabled="gameStore.feedback !== null" >{{ answer.body }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import router from '../routes'
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

.question-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.75rem;
}

.answers-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

</style>