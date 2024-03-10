<template>
    <div>
        <h1>Stats</h1>

        <table v-if="stats">
            <thead>
                <th>Username</th>
                <th>Total matches</th>
                <th>Total won matches (#)</th>
                <th>Total won matches (%)</th>
                <th>Total answers</th>
                <th>Total correct answers (#)</th>
                <th>Total correct answers (%)</th>
            </thead>
            <tbody>
                    <td>{{ stats.username }}</td>
                    <td>{{ stats.total_matches }}</td>
                    <td>{{ stats.total_won_matches }}</td>
                    <td>{{ Math.round((stats.total_won_matches / stats.total_matches) * 100) }}%</td>
                    <td>{{ stats.total_answers }}</td>
                    <td>{{ stats.total_correct_answers }}</td>
                    <td>{{ Math.round((stats.total_correct_answers / stats.total_answers) * 100) }}%</td>
                </tbody>
            </table>
    </div>
</template>

<script>

import api from "../api"

export default {
    data() {
        return {
            stats: null
        }
    },
    async mounted() {
        const stats = await api.stats()
        this.stats = stats
    }
}

</script>

<style>
</style>