import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import { connect } from "@/dbConfig/dbConfig";
import { verifyToken } from "@/helpers/tokenHelper";
import Question from "@/models/questionModel";

connect(); // Ensure the database connection is established

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(res.socket as any).server.io) {
    const io = new IOServer((res.socket as any).server);
    (res.socket as any).server.io = io;

    io.on("connection", (socket) => {
      socket.on("is-started", async () => {
        await Question.findOne({ isAnswered: false, isStarted: true }).then((question) => {
          if (!question) {
            socket.emit("no-questions", { error: "No unanswered questions available" });
            return;
          }
          const questionFormat = {
            question: question.question,
            options: question.options,
            timeLimit: question.timeLimit,
            askedOn: question.askedOn
          }
          socket.emit("question-started", questionFormat);
        });
      });
      socket.on("submit-answer", async (answer) => {
        await Question.findOne({ isAnswered: false, isStarted: true }).then( async (question) => {
            if (!question) {
                socket.emit("no-questions", { error: "No unanswered questions available" });
                return;
            }

            question.addAnswer(answer.name, answer.answer);
            // socket.emit("answer-submitted", { success: true, message: "Answer submitted successfully" });
        });
      });
      socket.on("time-left", async () => {
        const question = await Question.findOne({ isAnswered: false, isStarted: true });
        if (!question) {
          socket.emit("no-questions", { error: "No unanswered questions available" });
          return;
        }
        const timeLeft = question.timeLeft();
        if (timeLeft <= 0) {
          socket.emit("time-up", { message: "Time is up!" });
          question.isAnswered = true; // Mark the question as answered
          question.save();
          return;
        }
        socket.emit("time-left", { timeLeft });
      });
    });
  }
  res.end();
}