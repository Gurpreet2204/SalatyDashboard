import React, { useState } from 'react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async (message: string) => {
    setMessages([...messages, { sender: 'user', text: message }]);
    setInput('');

    try {
      const response = await fetch('https://backend-salary-dashboard.onrender.com/api/chat' , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: data.reply }]);
      } else {
        console.error('Error sending message:', response.statusText);
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="border border-gray-300 p-4 mb-4 h-64 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${msg.sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        className="border border-gray-300 p-2 w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && input.trim()) {
            sendMessage(input.trim());
          }
        }}
      />
      <button
        className="bg-blue-500 text-white p-2 mt-2"
        onClick={() => {
          if (input.trim()) {
            sendMessage(input.trim());
          }
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
