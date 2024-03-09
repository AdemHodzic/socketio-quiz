import { Socket, io } from "socket.io-client";

import { defineStore } from 'pinia'

import { join } from '../api'
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
            const match = await join();

            this.match = match;

            this.socket = io('http://localhost:3000')

            this.socket.emit('join', match.id)

            this.socket.on('start_game', handleStartGame)
            this.socket.on('next_question', (question) => {
                console.log("next_question", question)
                this.question = question
            })


            return match
        },
        leave() {
            console.log('leave')
        },
        answer(answerId: string) {
            console.log(answerId)
        }
    }
});

export default useGame;