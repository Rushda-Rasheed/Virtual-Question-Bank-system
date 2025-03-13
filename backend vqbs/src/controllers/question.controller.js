
import Question from '../models/question.model.js';
import Subject from '../models/subject.model.js';
import Topic from '../models/topic.model.js';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'public', 'uploads');

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});


export const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded." });
    }
   
    const imageUrls = req.files.map(file => `/uploads/questions/${file.filename}`);
    res.json({ imageUrls });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Server error while uploading images." });
  }
};


export const getQuestions = async (req, res) => {
  try {
      const { search, subject, topic, difficulty, type } = req.query;
      const filter = {};

      console.log("Incoming query parameters:", req.query);

      if (search) {
          filter.text = { $regex: search, $options: 'i' };
      }

      if (subject) {
          if (mongoose.Types.ObjectId.isValid(subject)) {
              filter.subject = subject;
          } else {
              return res.status(400).json({ error: "Invalid subject ID." });
          }
      }

      if (topic) {
          if (mongoose.Types.ObjectId.isValid(topic)) {
              filter.topic = topic;
          } else {
              return res.status(400).json({ error: "Invalid topic ID." });
          }
      }

      if (difficulty) {
          const allowedDifficulties = ['easy', 'medium', 'hard'];
          if (allowedDifficulties.includes(difficulty.toLowerCase())) {
              filter.difficulty = difficulty.toLowerCase();
          } else {
              return res.status(400).json({ error: "Invalid difficulty level." });
          }
      }

      if (type) {
          const allowedTypes = ['mcq', 'descriptive'];
          if (allowedTypes.includes(type.toLowerCase())) {
              filter.type = type.toLowerCase();
          } else {
              return res.status(400).json({ error: "Invalid question type." });
          }
      }

      console.log("Constructed filter:", filter);

      const questions = await Question.find(filter)
          .populate('subject', 'name')
          .populate('topic', 'name')
          .sort({ createdAt: -1 });

      if (questions.length === 0) {
          return res.status(404).json({ error: "No questions found for the specified filters." });
      }

      res.json(questions);
  } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Server error while fetching questions." });
  }
};



export const addQuestion = async (req, res) => {
  try {
    const { type, subject, topic, difficulty, text, images, options, correctOption, modelAnswer, explanation, keyPhrases } = req.body;

    if (!type || !subject || !topic || !difficulty || !text) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(404).json({ error: "Subject not found." });
    }

    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      return res.status(404).json({ error: "Topic not found." });
    }

    const allowedDifficulties = ['easy', 'medium', 'hard'];
    if (!allowedDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({ error: "Invalid difficulty level." });
    }

    const allowedTypes = ['mcq', 'descriptive'];
    if (!allowedTypes.includes(type.toLowerCase())) {
      return res.status(400).json({ error: "Invalid question type." });
    }

    if (type === 'mcq') {
      if (!options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: "MCQ must have at least two options." });
      }
      if (correctOption === null || correctOption >= options.length) {
        return res.status(400).json({ error: "Please select a valid correct option." });
      }
    }

    
    const newQuestion = new Question({
      type,
      subject,
      topic,
      difficulty,
      text,
      images,
      options: type === 'mcq' ? options : [],
      correctOption: type === 'mcq' ? correctOption : null,
      explanation: type === 'mcq' ? explanation : null, 
      modelAnswer: type === 'descriptive' ? modelAnswer : '',
      keyPhrases: type === 'descriptive' ? keyPhrases : null
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Server error while adding question." });
  }
};


export const updateQuestion = async (req, res) => {
  try {
    const { id, type, subject, topic, difficulty, text, images, options, correctOption, modelAnswer, explanation, keyPhrases } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Question ID is required." });
    }

    
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }

    
    if (type) {
      const allowedTypes = ['mcq', 'descriptive'];
      if (!allowedTypes.includes(type.toLowerCase())) {
        return res.status(400).json({ error: "Invalid question type." });
      }
      question.type = type;
    }

    if (subject) {
      const subjectExists = await Subject.findById(subject);
      if (!subjectExists) {
        return res.status(404).json({ error: "Subject not found." });
      }
      question.subject = subject;
    }

    if (topic) {
      const topicExists = await Topic.findById(topic);
      if (!topicExists) {
        return res.status(404).json({ error: "Topic not found." });
      }
      question.topic = topic;
    }

    if (difficulty) {
      const allowedDifficulties = ['easy', 'medium', 'hard'];
      if (!allowedDifficulties.includes(difficulty.toLowerCase())) {
        return res.status(400).json({ error: "Invalid difficulty level." });
      }
      question.difficulty = difficulty.toLowerCase();
    }

    if (text) {
      question.text = text;
    }

    if (images) {
      question.images = images;
    }

    if (type === 'mcq') {
      if (!options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({ error: "MCQ must have at least two options." });
      }
      if (correctOption === null || correctOption >= options.length) {
        return res.status(400).json({ error: "Please select a valid correct option." });
      }
      question.options = options;
      question.correctOption = correctOption;
      question.explanation = explanation || ''; 
      question.modelAnswer = ''; 
      question.keyPhrases = null; 
    } else if (type === 'descriptive') {
      question.modelAnswer = modelAnswer || '';
      question.keyPhrases = keyPhrases || ''; 
      question.options = [];
      question.correctOption = null;
      question.explanation = null;
    }

    await question.save();
    res.json(question);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: "Server error while updating question." });
  }
};



export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Question ID is required." });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }

    await Question.findByIdAndDelete(id);
    res.json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: "Server error while deleting question." });
  }
};


export const bulkUpdateQuestions = async (req, res) => {
  try {
    const { questionIds, updateData } = req.body;

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ error: "No question IDs provided for bulk update." });
    }

   
    await Question.updateMany(
      { _id: { $in: questionIds } },
      { $set: updateData }
    );

    res.json({ message: "Questions updated successfully." });
  } catch (error) {
    console.error("Error bulk updating questions:", error);
    res.status(500).json({ error: "Server error while bulk updating questions." });
  }
};
