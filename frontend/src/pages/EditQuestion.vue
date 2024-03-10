<template>
    <div>
        <h1>Edit Question</h1>
        <form @submit.prevent="updateQuestion">
            <div class="form-group">
                <label for="question">Question</label>
                <input type="text" id="question" v-model="question.body" />
            </div>

            <div class="form-group">
                <label for="answers">Answers</label>
                <div v-for="(answer, idx) in question.answers" :key="idx">
                    <input type="text" v-model="question.answers[idx].body" />
                    <input type="checkbox" v-model="question.answers[idx].is_correct" />
                </div>
            </div>

            <button type="submit">Update</button>
        </form>
    </div>
</template>

<script>

import api from '../api'

export default {
    data() {
        return {
            question: {},
        }
    },
    methods: {
        async fetchQuestion() {
            const { question } = await api.getQuestion(this.$route.params.id)
            this.question = question
        },
        async updateQuestion() {
            await api.updateQuestions({questions: [this.question]})
            this.$router.push({ name: 'admin' })
        }
    },
    mounted() {
        this.fetchQuestion()
    }
}
</script>