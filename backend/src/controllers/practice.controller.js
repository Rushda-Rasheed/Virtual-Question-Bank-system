
import Question from '../models/question.model.js';

export async function getFilteredQuestions(req, res) {
  const { subject, topic, difficulty, searchKeyword } = req.query;

  try {
    const query = {};

    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    if (searchKeyword) query.text = { $regex: searchKeyword, $options: 'i' };

    const questions = await Question.find(query)
      .populate('subject')
      .populate('topic');

   
    const filteredQuestions = questions.map(q => ({
      questionId: q._id, 
      text: q.text,      
      images: q.images && Array.isArray(q.images) ? q.images : [],
      type: q.type,
      options: q.type === 'mcq' ? q.options : [],
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
    }));
   
    res.status(200).json(filteredQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching questions' });
  }
}

export async function startExam(req, res) {
  const { subject, topic, difficulty, questionIds } = req.body;
 

  if (!subject || !topic || !difficulty || !Array.isArray(questionIds)) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  res.status(200).json({ 
    message: 'Exam started', 
    subject, 
    topic, 
    difficulty, 
    questionIds 
  });
}  
