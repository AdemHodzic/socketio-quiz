<template>
    <div>
        <h1>Add Question</h1>
        <form @submit.prevent="addQuestion">
            <div class="form-group">
                <label for="question">Question</label>
                <input type="text" id="question" v-model="body" />
            </div>

            <br>

            <div class="form-group">
                <table>
                    <thead>
                        <tr>
                            <th>Answer</th>
                            <th>Is Correct</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-for="(answer, idx) in answers" :key="idx">
                            <td><input type="text" v-model="answer.body" /></td>
                            <td><input type="checkbox" v-model="answer.is_correct" /></td>
                            <td><button @click="removeAnswer(idx)">Remove</button></td>
                        </tr>
                    </tbody>
                </table>
                <button type="button" @click="addAnswer">Add answer</button>
            </div>
            <br>

            <button type="submit" :disabled="!isValidQuestion">Create Question</button>
        </form>
    </div>
</template>

<script>

import api from "../api";

export default {
    data () {
        return {
            body: '',
            answers: []
        }
    
    },
    computed: {
        isValidQuestion () {
            // Question should have some text, 4 answers and exactly one correct answer
            return this.body.length >= 3 && this.answers.length === 4 && this.answers.filter(answer => answer.is_correct).length === 1; 
        }
    },
    methods: {
        addAnswer() {
            this.answers.push({ body: '', is_correct: false});
        },
        removeAnswer(index) {
            this.answers.splice(index, 1);
        },
        async addQuestion() {

            const question = {
                body: this.body,
                answers: this.answers
            }

            await api.createQuestions({ questions: [question] });

            this.$router.push({ name: 'admin' });
        }
    }
}
</script>

<style>
table {
  border: 1px solid black;
}

</style>