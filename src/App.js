import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f0f0; 
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const Message = styled.div`
  background-color: ${({ isUser }) => (isUser ? '#DCF8C6' : '#fff')}; 
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')}; 
`;

const InputArea = styled.div`
  display: flex;
  padding: 10px;
  background-color: #fff; 
`;

const InputField = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 10px 15px;
  background-color: #0084ff; 
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const sendMessage = async () => {
    if (inputValue.trim() === '') return;

    const startTime = Date.now();
    setIsLoading(true);

    try {
      const newMessage = {
        text: inputValue,
        isUser: true
      };
      setMessages([...messages, newMessage]);
      setInputValue('');

      const response = await axios.post('http://localhost:5000/api/generate', {
        message: inputValue
      });

      const endTime = Date.now();
      setResponseTime(endTime - startTime);

      setMessages(prevMessages => [
        ...prevMessages,
        { text: response.data.response, isUser: false }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Error: Could not generate a response.', isUser: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Container>
      <MessageList>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <InputArea>
        <InputField
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <SendButton onClick={sendMessage} disabled={isLoading}>
          {isLoading ? '...' : 'Send'}
        </SendButton>
      </InputArea>
    </Container>
  );
};

export default App;