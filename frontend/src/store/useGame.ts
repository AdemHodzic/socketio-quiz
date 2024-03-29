import { Socket, io } from "socket.io-client";

import { defineStore } from 'pinia'

import api from '../api'
import router from "../routes";


const useGame = defineStore('game', {
    //
    state: () => ({ match: null as any | null, socket: null as Socket | null, question: null as any | null, feedback: null as boolean | null }),
    actions: {
        async join() {
            const match = await api.join();

            this.match = match;

            this.socket = io('http://localhost:3000')

            this.socket.emit('join', match.id)

            this.socket.on('start_game', () => {
                router.push({ name: 'game' })
            })
            this.socket.on('next_question', (question) => {
                this.feedback = null
                this.question = question

            })

            this.socket.on('end_game', (match) => {
                const { id } = match;

                this.match = null;
                this.socket?.disconnect()
                this.socket = null

                router.push({ name: 'results', params: { matchId: id } })
            })

            this.socket.on('cancel_game', () => {
                this.match = null;
                this.socket?.disconnect()
                this.socket = null
            })

            this.socket.on('answer_result', ({ correct }) => {
                this.feedback = correct
            })

            return match
        },
        leave() {
            if (this.socket) {
                this.match = null;

                this.socket.disconnect();
                this.socket = null;

                router.push({ name: 'main' })
            }
        },
        answer(answerId: string) {
            const token = localStorage.getItem('token');
            const matchId = this.match?.id;
            const questionId = this.question?.id;
            this.socket?.emit('answer', { token, matchId, questionId, answerId })
        }
    }
});

export default useGame;