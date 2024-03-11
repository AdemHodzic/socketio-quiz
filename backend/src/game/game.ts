import { Server, Socket } from "socket.io";

import { Answer, Match, Question } from "@prisma/client";
import { answerQuestion, end_game, getNextQuestion } from "./service";

import { Server as HttpServer } from "node:http";


type EventsMap = {
    "join": string,
    "next_question": Question & { answers: Answer[] },
    "answer": {
        matchId: number,
        questionId: number,
        answerId: number,
        token: string,
    },
    "answer_result": { correct: boolean },
    "end_game": Match,
    "start_game": void,
};

type Events = keyof EventsMap;

export default class Game {
    io: Server;

    constructor(server: HttpServer) {
        this.io = new Server(server, {
            cors: {
              origin: "*", 
            }
          });

          this.io.of("/").adapter.on("join-room", async (room, id) => {
            console.log(`socket ${id} has joined room ${room}`);
            const roomSize = this.io.sockets.adapter.rooms.get(room)?.size;
            if (roomSize === 2) {
              console.log(`Starting game in room ${room}`);
              this.start_game(room);
            }
          });
          
          this.io.of("/").adapter.on("leave-room", async (room, id) => {
            console.log(`socket ${id} has left room ${room}`);
            this.end_game(room);
          });

          this.io.on('connection', (socket: Socket) => {
            socket.on('join', this.handle('join', socket))
            socket.on('answer', this.handle('answer', socket))
          });
  
        }
      
    // handles incoming events
    // join and answer can't be their own methods because they need access to the socket
    handle<T extends Events>(event: T, socket: Socket): (...args: any) => any {
        switch (event) {
          case "join":
            
            return (room) => {
              socket.join(room);
            };
          case "answer":
            return async (data: EventsMap["answer"]) => {
              const result  = await answerQuestion(data);

              if (result === 'INVALID_ANSWER') {
                return;
              }

              if (result === "CORRECT") {
                this.emit_socket(socket, "answer_result", { correct: true });
              } else {
                this.emit_socket(socket, "answer_result", { correct: false });
              }

              if (result === "CORRECT" || result === "EVERYONE_ANSWERED") {
                const { matchId } = data;
                console.log("matchId", matchId);
                //@ts-ignore
                this.next_question(matchId);
              } 
            }
          default:
            return () => {};
        }
    }

    emit_socket<T extends Events>(socket: Socket, event: T, payload?: EventsMap[T]): void {
        socket.emit(event, payload);
    }

    emit<T extends Events>(room: string, event: T, payload?: EventsMap[T]): void {
        this.io.to(room).emit(event, payload);
    }

    async start_game (matchId: string) {
        this.emit(matchId, "start_game");
        this.next_question(matchId)
    }

    async next_question (matchId: string) {
        const question = await getNextQuestion(parseInt(matchId));

        console.log("questions", question)
        if (!question) {
          this.end_game(matchId);
          return;
        }

        this.emit(matchId, "next_question", question);
    }

    async end_game (matchId: string) {
        const match = await end_game(parseInt(matchId));

        console.log("end game", match)
        if (match) {
          this.emit(matchId, "end_game", match);
        }
    }

}

