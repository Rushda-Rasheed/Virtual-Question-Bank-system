

import mongoose from 'mongoose';

const { Schema } = mongoose;

const questionSchema = new Schema({
  type: {
    type: String,
    enum: ['mcq', 'descriptive'],
    required: true
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  images: [{
    type: String 
  }],
  options: [{
    type: String 
  }],
  correctOption: {
    type: Number, 
    min: 0
    

  },

  explanation: {
    type: String 
  },
  modelAnswer: {
    type: String 
  },
  keyPhrases: {
    type: String 
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);

