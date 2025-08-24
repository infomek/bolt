import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, ThumbsUp, MessageCircle } from 'lucide-react';
import UserAvatar from '../UserAvatar';
import './Tabs.css';

function ChatTab({ project }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Sample data for demonstration
  const chatMessages = [
    {
      id: 1,
      user: 'Priva Sharma',
      message: 'Lorem ipsum dolor sit amet, coetur adipiscing elit ut aliquam, purus sit amet luctus Lorem ipsum dolor sit amet aliquam, purus sit amet luctus',
      timestamp: '2 mins',
      avatar: '/api/placeholder/32/32',
      likes: 15,
      replies: 6
    },
    {
      id: 2,
      user: 'Alex Johnson',
      message: 'Lorem ipsum dolor sit amet, coetur adipiscing elit ut.',
      timestamp: '2 mins',
      avatar: '/api/placeholder/32/32',
      likes: 15,
      replies: 6
    }
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Add message logic here
      setMessage('');
      // Scroll to bottom after sending message
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div className="chat-section">
      <div className="chat-messages scrollable">
        {chatMessages.map((msg) => (
          <div key={msg.id} className="chat-message">
            <div className="avatar-container">
              <UserAvatar user={{ name: msg.user }} size="small" />
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-user">{msg.user}</span>
                <span className="message-time">{msg.timestamp}</span>
              </div>
              <p className="message-text">{msg.message}</p>
              <div className="message-actions">
                <button className="message-action">
                  <ThumbsUp size={16} />
                  <span>{msg.likes} Like</span>
                </button>
                {/* <button className="message-action">
                  <MessageCircle size={16} />
                  <span>{msg.replies} Replies</span>
                </button> */}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSendMessage}>
        <button type="button" className="attach-btn">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="send-btn" disabled={!message.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default ChatTab; 