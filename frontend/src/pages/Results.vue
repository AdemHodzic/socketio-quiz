<template>
    <h1>Match result: {{  resultsInText }}</h1>

    <router-link :to="{'name': 'main'}">Go to main menu</router-link>

    <!-- <pre>{{ this.results }}</pre> -->

    <table>
        <thead>
            <th>Queestion</th>
            <th>Your answer</th>
            <th>Opponent Answer</th>
            <th>Correct Answer</th>
        </thead>
        <tbody>
            <tr v-for="result in results">
                <td>{{ result.question }}</td>
                <td :style="{'background': result.question_winner === authStore.user.id ? 'green' : 'red'}" ></td>
                <td :style="{'background': result.question_winner !== null && result.question_winner !== authStore.user.id ? 'green' : 'red'}"></td>
                <td>{{ result.question_answer }}</td>
            </tr>
        </tbody>
    </table>

    <br><br>


</template>

<script>

import api from "../api"

import useAuth from "../store/useAuth"

import { mapStores } from "pinia"

export default {
    data() {
        return {
            results: null
        }
    },
    computed: {
        ...mapStores(useAuth),
        resultsInText () {
            if (this.results) {
                const yourScore = this.results.filter(result => result.question_winner === this.authStore.user.id).length
                const opponentScore = this.results.filter(result => result.question_winner !== null && result.question_winner !== this.authStore.user.id).length

                if (yourScore > opponentScore) {
                    return 'You win!'
                } else if (yourScore < opponentScore) {
                    return 'You lose!'
                } else {
                    return 'It\'s a tie!'
                }
            }
        }
    },
    created() {
        this.getMatch()
    },
    methods: {
        async getMatch() {
            const matchId = this.$route.params.matchId
            const results = await api.results(matchId)
            this.results = results
        }
    }
}

</script>

<style>
</style>