
const Question = require("./models/questionModel.js").default;

const { connect } = require("./dbConfig.js");
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
connect(); // Connect to MongoDB

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    // Broadcast the message to all connected clients
    io.emit('message', msg);
  });

  socket.on("is-started", async () => {
    console.log("Checking for unanswered questions...");
    // let q = await Question.find({});
    // console.log("Questions found:", q.length, q);
    await Question.findOne({ isAnswered: false, isStarted: true }).then((question) => {
      if (!question) {
        console.log("No unanswered questions available");
        socket.emit("no-questions", { error: "No unanswered questions available" });
        return;
      }
      const questionFormat = {
        question: question.question,
        options: question.options,
        timeLimit: question.timeLimit,
        askedOn: question.askedOn
      }
      console.log("Unanswered question found:", questionFormat);
      socket.emit("question-started", questionFormat);
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
});

server.listen(4000, '192.168.1.6', () => {
  console.log('Socket server running on port 4000');
});
