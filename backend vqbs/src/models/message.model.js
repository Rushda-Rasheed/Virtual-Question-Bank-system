

import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});


const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  receiverRole: { type: String, required: true }, 
  content: { type: String, required: true },
  replies: [replySchema], 
  replied: { type: Boolean, default: false }, 
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
