import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in your environment variables
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Please provide a message." });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert chatbot specialized in SDG 16, human rights, justice, laws, and governance. Answer clearly and politely. Include definitions and examples when relevant. You also respond to greetings and introductions.`
        },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const botReply = completion.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ reply: "Sorry, I am having trouble answering right now." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AI SDG 16 Chatbot</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #eef2f7;
      padding: 20px;
      max-width: 700px;
      margin: auto;
    }
    h1 {
      color: #004080;
      text-align: center;
    }
    #chat-box {
      border: 1px solid #ccc;
      background: white;
      padding: 15px;
      height: 400px;
      overflow-y: auto;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    p {
      margin: 8px 0;
    }
    .user {
      color: #007bff;
      font-weight: bold;
    }
    .bot {
      color: #333;
      font-weight: bold;
    }
    input[type="text"] {
      width: 75%;
      padding: 10px;
      font-size: 16px;
      border-radius: 4px;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
    button {
      padding: 10px 15px;
      font-size: 16px;
      border-radius: 4px;
      border: none;
      background-color: #007bff;
      color: white;
      cursor: pointer;
      margin-left: 10px;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <h1>AI SDG 16 Chatbot</h1>
  <div id="chat-box"></div>
  <input id="user-input" type="text" placeholder="Ask me about SDG 16, human rights, justice..." autocomplete="off" />
  <button id="send-btn">Send</button>

  <script>
    const chatBox = document.getElementById('chat-box');
    const inputBox = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    async function sendMessage() {
      const userMessage = inputBox.value.trim();
      if (!userMessage) return;

      appendMessage('You', userMessage, 'user');
      inputBox.value = '';
      inputBox.disabled = true;
      sendBtn.disabled = true;

      try {
        const response = await fetch('http://localhost:3000/chat', { // Adjust URL if deployed elsewhere
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        appendMessage('Bot', data.reply, 'bot');
      } catch (error) {
        appendMessage('Bot', 'Sorry, something went wrong. Please try again.', 'bot');
        console.error(error);
      }

      inputBox.disabled = false;
      sendBtn.disabled = false;
      inputBox.focus();
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function appendMessage(sender, text, className) {
      const p = document.createElement('p');
      p.innerHTML = `<strong class="${className}">${sender}:</strong> ${text}`;
      chatBox.appendChild(p);
    }

    sendBtn.addEventListener('click', sendMessage);
    inputBox.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMessage();
    });

    // Optionally, greet user on page load
    window.onload = () => {
      appendMessage('Bot', 'Hello! I am your SDG 16 and Human Rights chatbot. Ask me anything about peace, justice, human rights, and governance.', 'bot');
      inputBox.focus();
    };
  </script>
</body>
</html>
