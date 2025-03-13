

import { useEffect, useContext, useState } from 'react';
import AuthContext from '@/context/AuthContext';
import Layout from '../../components/Layout'; 
import toast from 'react-hot-toast';

const AdminMessageView = () => {
  const { fetchMessages, replyToMessage, messages } = useContext(AuthContext);
  const [reply, setReply] = useState('');
  const [activeMessageId, setActiveMessageId] = useState(null);

  useEffect(() => {
    fetchMessages(); 
  }, []);

  const handleReply = async () => {
    if (reply.trim() === '' || !activeMessageId) return;

    try {
      const response = await replyToMessage(activeMessageId, reply);
      if (response?.success) {
        setReply('');
        setActiveMessageId(null);
        fetchMessages(); 
        toast.success('Reply sent successfully');
      }
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

return (
    <Layout>
      <div>
        <h1 className="text-xl font-bold">Admin Messages</h1>
        <div className="mt-4">
          {messages
            .filter((msg) => !msg.replied) 
            .map((msg) => (
              <div key={msg._id} className="p-4 border rounded mb-2">
                <p><strong>User:</strong> {msg.senderId.username}</p>
                <p><strong>Message:</strong> {msg.content}</p>
                <p><em>{new Date(msg.timestamp).toLocaleString()}</em></p>
                <textarea
                  value={reply}
                  onChange={(e) => {
                    setActiveMessageId(msg._id);
                    setReply(e.target.value);
                  }}
                  placeholder="Write your reply..."
                  rows="3"
                  className="border rounded p-2 w-full mt-2"
                />
                <button
                  onClick={handleReply}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                >
                  Send Reply
                </button>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminMessageView;















