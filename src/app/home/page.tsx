'use client'; // Since fetching from the frontend requires interactivity
import { useState, useEffect } from 'react';
export default function Home() {
  const [messages, setMessages] = useState([]);
  const channelId = 'C07TC0XJC03'; // Replace with your actual Slack channel ID  
  useEffect(() => {

    async function fetchMessages() {
      try {
        const response = await fetch(`/api/slackMessages?channelId=${channelId}`);
        console.log(response);
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    } fetchMessages();
  }, []);
  return (
    <div>
      <h1>Slack Messages</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message.text}</li>
        ))}
      </ul>
    </div>
  );
}
