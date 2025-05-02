
import Message from '../models/message.model.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverRole, content } = req.body;
    const senderId = req.user?.id; 

    if (!senderId) {
      return res.status(400).json({ error: 'User not authenticated.' });
    }

    const newMessage = new Message({ senderId, receiverRole, content });
    await newMessage.save();
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



export const replyToMessage = async (req, res) => {
  try {
    const { messageId, replyContent } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ success: false, error: 'Admin not authenticated.' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }

    message.replies.push({
      senderId: adminId,
      content: replyContent,
    });

    message.replied = true;

    await message.save();

    const userId = message.senderId; 
    res.status(200).json({
      success: true,
      message: 'Reply sent successfully.',
      reply: {
        messageId: message._id,
        replyContent,
        sentTo: userId, 
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query;

    if (role === 'admin') {
      query = { receiverRole: 'admin' };
    } else {
      query = { senderId: userId }; 
    }

    const messages = await Message.find(query)
      .populate('senderId', 'username') 
      .populate('replies.senderId', 'username') 
      .sort({ timestamp: -1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
