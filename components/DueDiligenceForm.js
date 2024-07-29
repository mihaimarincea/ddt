'use client';

import React, { useState, useEffect, useRef } from 'react';
import { questions } from '../utils/questions';

export default function DueDiligenceForm({ onSubmit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    console.log('DueDiligenceForm mounted');
    return () => {
      console.log('DueDiligenceForm unmounted');
    };
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      console.log('Adding initial question');
      setMessages([{ content: questions[0].question, sender: 'bot' }]);
      isInitialMount.current = false;
    } else {
      console.log('currentQuestion changed:', currentQuestion);
    }
  }, [currentQuestion]);

  const handleNextQuestion = () => {
    if (currentAnswer.trim() !== '') {
      const newMessages = [
        ...messages,
        { content: currentAnswer, sender: 'user' }
      ];

      if (currentQuestion < questions.length - 1) {
        newMessages.push({
          content: questions[currentQuestion + 1].question,
          sender: 'bot'
        });
      }

      setMessages(newMessages);
      setAnswers({ ...answers, [questions[currentQuestion].id]: currentAnswer });
      setCurrentAnswer('');

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prevQuestion => prevQuestion + 1);
      } else {
        onSubmit(answers);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNextQuestion();
    }
  };

  console.log('Rendering DueDiligenceForm, messages:', messages);

  return (
    <>
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer here..."
        />
        <button onClick={handleNextQuestion}>
          {currentQuestion < questions.length - 1 ? 'Next' : 'Submit'}
        </button>
      </div>
    </>
  );
}