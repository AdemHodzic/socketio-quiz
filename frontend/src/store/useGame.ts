import { Socket, io } from "socket.io-client";

import { defineStore } from 'pinia'

import api from '../api'
import router from "../routes";

const handleStartGame = () => {
    router.push({ name: 'game' })
}

const useGame = defineStore('game', {
    //
    state: () => ({ match: null as any | null, socket: null as Socket | null, question: null as any | null }),
    actions: {
        async join() {
            console.log('join')
            const match = await api.join();

            this.match = match;

            this.socket = io('http://localhost:3000')

            this.socket.emit('join', match.id)

            this.socket.on('start_game', handleStartGame)
            this.socket.on('next_question', (question) => {
                console.log("next_question", question)
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
            console.log(answerId)
        }
    }
});

export default useGame;