# Ritesh AI

Ritesh AI is a lightweight AI chatbot inspired by modern conversational interfaces like ChatGPT and Gemini.  
The project supports text conversations, document uploads, and image understanding using AI models through the OpenRouter API.

The goal of this project was to build a clean and responsive AI assistant using only HTML, CSS, JavaScript, and Node.js without using any database.

---

# Live Demo

The project is deployed and accessible online using Render:

https://ritesh-ai.onrender.com/


## Features

- Real-time chat interface
- AI-generated responses
- Upload and analyze PDF files
- Upload TXT documents
- Upload and analyze images (PNG/JPG)
- Context-aware conversations
- New Chat option to reset conversation memory
- Stop response generation button
- Drag and drop file upload
- Markdown response rendering
- Mobile responsive UI

---

## Tech Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript

### Backend
- Node.js
- Express.js

### AI Integration
- OpenRouter API
- Mistral 7B Instruct model

---

# Project Structure

```txt
ritesh-ai/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── uploads/
│
├── server.js
├── package.json
├── README.md
├── .gitignore
└── .env
```

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/riteshkumar32/ritesh-ai.git
```

---

## 2. Move into the Project Directory

```bash
cd ritesh-ai
```

---

## 3. Install Dependencies

```bash
npm install
```

---

# Setting Up the API Key

This project uses OpenRouter for AI responses.

## Create a `.env` file

Create a file named:

```txt
.env
```

Add the following:

```env
OPENROUTER_API_KEY=your_api_key_here
PORT=3000
```

Replace:

```txt
your_api_key_here
```

with your actual OpenRouter API key.

---

# Running the Project

Start the server:

```bash
npm start
```

If everything is working correctly, you should see:

```txt
==================================
Ritesh AI running on:
http://localhost:3000
==================================
```

Open your browser and visit:

```txt
http://localhost:3000
```

---

# Example Usage

## Basic Chat

Type a message like:

```txt
Hello
```

and press Enter.

---

## Upload a PDF

1. Click the upload button
2. Select a PDF file
3. Ask questions such as:

```txt
Summarize this document
```

or

```txt
What are the key points?
```

---

## Upload an Image

1. Upload a PNG/JPG image
2. Ask:

```txt
Describe this image
```

or

```txt
What objects are visible here?
```

---

## Start a New Chat

Click the **New Chat** button to:
- clear message history
- remove uploaded document context
- remove uploaded images
- start a completely fresh session

---

# Deployment

The project can be deployed entirely on Render.

Current deployment setup:
- Frontend served through Express static files
- Backend hosted on Render Web Service

---

# Notes

- Chat history is stored only for the current session
- No database is used
- Uploaded files are processed temporarily and removed after parsing
- Context resets when starting a new chat or restarting the server

---

# Future Improvements

- Multi-chat sidebar
- User authentication
- Real-time streaming responses
- Voice input/output
- Better markdown rendering
- Persistent cloud chat history

---

# Author

Ritesh Kumar

GitHub:  
https://github.com/riteshkumar32
