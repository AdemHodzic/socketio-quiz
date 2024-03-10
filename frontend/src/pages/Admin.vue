<template>
    <div>
        <h1>Admin panel</h1>

        <router-link :to="{ 'name': 'new-question'}">Add new question</router-link>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Question</th>
                    <th>Answers</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="question in questions" :key="question.id">
                    <td>{{ question.id }}</td>
                    <td>{{ question.body }}</td>
                    <td>
                        <span v-for="(answer, idx) in question.answers" :style="{'color': answer.is_correct ? 'green' : 'red'}">
                            {{ answer.body  }}
                            <span :style="{'color': 'black', 'fontWeight': 'bold'}" v-if="idx !== question.answers.length - 1">||</span>
                        </span>
                    </td>
                    <td>
                        <button @click="deleteQuestion(question.id)">Delete</button>
                        <button @click="editQuestion(question.id)">Edit question</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import api from '../api'

export default {
    data() {
        return {
            questions: [],
        }
    },
    methods: {
        async fetchQuestions() {
            const { questions } = await api.getQuestions()
            this.questions = questions
        },
        async deleteQuestion(id) {
            await api.deleteQuestions([id])
            this.questions = this.questions.filter(question => question.id !== id)
        },
        editQuestion(id) {
            console.log('edit question', id)
            this.$router.push({
                name: 'edit-question',
                params: { id }
            })
        }
    },
    mounted() {
        this.fetchQuestions()
    }
}
</script>

<style>


table {
  border-collapse: separate;
  border-spacing: 50px 0;
}

td {
  padding: 10px 0;
}
</style>