
import mongoose from 'mongoose';

const extractQuestionId = (req, res, next) => {
  const { questionId } = req.body;

  if (!questionId) {
    return res.status(400).json({ message: 'Question ID is required.' });
  }

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(400).json({ message: 'Invalid Question ID format.' });
  }

  req.questionId = questionId;
  next();
};

export default extractQuestionId;
