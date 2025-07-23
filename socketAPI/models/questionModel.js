"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var QuestionSchema = new mongoose_1.default.Schema({
    question: {
        type: String,
        required: [true, "Please provide an question"]
    },
    options: {
        type: String,
        required: [true, "Please provide a password"]
    },
    rightOption: {
        type: Number,
        required: [true, "Please provide a right option"]
    },
    timeLimit: {
        type: String,
        required: [true, "Please provide a time limit"]
    },
    isAnswered: {
        type: Boolean,
        default: false
    },
    isStarted: {
        type: Boolean,
        default: false
    },
    askedOn: {
        type: Date,
        default: function () { return Date.now(); }
    },
    answersGiven: {
        type: [
            {
                name: { type: String, required: true },
                answer: { type: String, required: true }
            }
        ],
        default: []
    }
});
QuestionSchema.methods.timeLeft = function () {
    if (!this.isStarted || this.isAnswered)
        return 0;
    var timeElapsed = Date.now() - this.askedOn.getTime();
    var timeLimitInMs = parseInt(this.timeLimit) * 1000; // Assuming timeLimit is in seconds
    return Math.max(0, timeLimitInMs - timeElapsed);
};
QuestionSchema.methods.addAnswer = function (name, answer) {
    this.answersGiven.push({ name: name, answer: answer });
    return this.save();
};
var Question = mongoose_1.default.models.questions || mongoose_1.default.model("questions", QuestionSchema);
exports.default = Question;
