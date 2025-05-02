
import Exam from '../models/exam.model.js';
import Question from '../models/question.model.js';
import { createNotification } from './notification.controller.js'; 

const sanitizeText = (text) => {
  return text.replace(/<\/?[^>]+(>|$)/g, "").trim(); 
};

export const submitExam = async (req, res) => {
  try {
    const { answerData, subject, topic, difficulty, timeTaken } = req.body;
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(400).json({ error: "User not authenticated." });
    }

    if (!Array.isArray(answerData)) {
      return res.status(400).json({ error: "answerData must be an array." });
    }

    let correctAnswersCount = 0;

    const resultQuestions = await Promise.all(
      answerData.map(async ({ questionId, userAnswer }) => {
        const question = await Question.findById(questionId);
        let explanation = null;
        let matchStatus = null;
        let isCorrect = false;

        const sanitizedUserAnswer = sanitizeText(userAnswer);

        if (question.type === 'mcq') {
          
          const correctOption = question.correctOption;
          const correctOptionText = question.options[correctOption]; 
          
          isCorrect = 
            (parseInt(sanitizedUserAnswer) === correctOption) || 
            (sanitizedUserAnswer.trim().toLowerCase() === correctOptionText.trim().toLowerCase());
          explanation = question.explanation;

        } else if (question.type === 'descriptive') {
          
          const keyPhrases = question.keyPhrases ? question.keyPhrases.split(',').map(phrase => phrase.trim().toLowerCase()) : [];
          const normalizedUserAnswer = sanitizedUserAnswer.toLowerCase();

          
          const matchingPhrases = keyPhrases.filter(phrase => normalizedUserAnswer.includes(phrase));
          const matchPercentage = keyPhrases.length > 0 ? (matchingPhrases.length / keyPhrases.length) * 100 : 0;

          isCorrect = matchPercentage >= 30;
          matchStatus = matchPercentage >= 30 ? '30%+ match' : 'Less than 30% match';

          explanation = sanitizeText(question.modelAnswer);
        }

        if (isCorrect) correctAnswersCount++;

        return {
          questionId,
          userAnswer: sanitizedUserAnswer,
          isCorrect,
          explanation,
          matchStatus,
          score: isCorrect ? 1 : 0
        };
      })
    );

    const exam = new Exam({
      userId,
      subject: { id: subject.id, name: subject.name },
      topic: { id: topic.id, name: topic.name },
      difficulty,
      timeTaken, 
      selectedAnswers: resultQuestions,
      score: resultQuestions.reduce((total, q) => total + q.score, 0),
      correctAnswers: correctAnswersCount,
      totalQuestions: resultQuestions.length,
      incorrectAnswers: resultQuestions.length - correctAnswersCount,
      submittedAt: new Date(),
    });

    await exam.save();

    const notificationMessage = `Congratulations! Your exam results have been declared. You scored ${exam.score}/${exam.totalQuestions}.`;
    await createNotification(userId, notificationMessage); 
    res.status(201).json({
      exam, 
      message: "Exam submitted successfully, and your results are now available.",
      notification: {
        message: notificationMessage,
        timestamp: new Date(),
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error submitting exam.' });
  }
};

export const getExamResults = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User not authenticated." });
    }

    const results = await Exam.find({ userId }).populate('selectedAnswers.questionId', 'questionText'); // Adjust 'questionText' to the field you need

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching exam results." });
  }
};

export const getAllExamResults = async (req, res) => {
  try {
    const results = await Exam.find().populate('selectedAnswers.questionId', 'questionText');
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching all exam results:", error);
    res.status(500).json({ error: "Error fetching all exam results." });
  }
};
