
import { useEffect, useContext, useState } from 'react';
import AuthContext from '@/context/AuthContext';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

const SendMessage = () => {
  const { sendMessage, fetchMessages, messages } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMessages(); 
  }, [fetchMessages]);

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      toast.error('Message cannot be empty');
      return;
    }

    try {
      const response = await sendMessage('admin', message);
      if (response?.success) {
        setMessage('');
        toast.success('Message sent successfully');
        fetchMessages(); 
      }
    } catch (error) {
      toast.error('An error occurred while sending the message');
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          rows="4"
          className="border rounded p-2 w-full"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Send Message
        </button>
        <div className="mt-8">
          <h1 className="text-xl font-bold">Your Messages</h1>
          {messages.map((msg) => (
            <div key={msg._id} className="p-4 border rounded mb-2">
              <p><strong>You:</strong> {msg.content}</p>
              <p><em>{new Date(msg.timestamp).toLocaleString()}</em></p>
              <h3 className="font-bold mt-2">Replies:</h3>
              {msg.replies.map((reply) => (
                <div key={reply._id}>
                  <p><strong>Admin:</strong> {reply.content}</p>
                  <p><em>{new Date(reply.timestamp).toLocaleString()}</em></p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );


};

export default SendMessage;
