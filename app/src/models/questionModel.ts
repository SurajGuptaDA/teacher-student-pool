import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
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
        default: () => Date.now()
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
QuestionSchema.methods.timeLeft = function() {
    if (!this.isStarted || this.isAnswered) return 0;
    const timeElapsed = Date.now() - this.askedOn.getTime();
    const timeLimitInMs = parseInt(this.timeLimit) * 1000; // Assuming timeLimit is in seconds
    return Math.max(0, timeLimitInMs - timeElapsed);
};
QuestionSchema.methods.addAnswer = function(name: string, answer: string) {
    this.answersGiven.push({ name, answer });
    return this.save();
};

const Question = mongoose.models.questions || mongoose.model("questions", QuestionSchema);

export default Question;