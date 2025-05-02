
import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { 
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    name: { type: String, required: true }
  },
  topic: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    name: { type: String, required: true }
  },
  difficulty: { type: String, required: true },
  timeTaken: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  incorrectAnswers: { type: Number, required: true },
  
  selectedAnswers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      userAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
      explanation: { type: String },
      matchStatus: { type: String }
    }
  ],
  
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
