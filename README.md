# 🚀 AI Resume Analyzer

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg?style=for-the-badge)](https://resume-analyzer-one-dusky.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)]()
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)]()

An enterprise-grade, polyglot microservices application that leverages Artificial Intelligence to analyze resumes against specific job descriptions. By utilizing **Google Gemini** and **LangChain**, the engine extracts unstructured PDF data, evaluates candidate fit, and returns strict, typed JSON responses for the frontend.

## 🌟 Live Demo
**[Try the Live Application Here](https://resume-analyzer-one-dusky.vercel.app/)**

*(Note: The backend services are hosted on Render's free tier. If the application has not been used in the last 15 minutes, the initial analysis may take 45-60 seconds while the servers wake up. Subsequent requests will be lightning-fast.)*

---

## 🏗️ System Architecture

This project is decoupled into three distinct layers to ensure scalability, separation of concerns, and efficient memory management.

1. **Frontend (Client UI)**: Built with **React** and **Vite**. Deployed on **Vercel**. Provides a sleek, responsive UI for users to upload PDFs and paste job descriptions.
2. **API Gateway (Node.js/Express)**: Hosted on **Render**. Acts as a secure intermediary. It utilizes `multer` to handle multipart/form-data, buffering the PDF directly in RAM (avoiding disk writes) before securely proxying the payload to the AI engine.
3. **AI Engine (Python/FastAPI)**: Hosted on **Render**. The "brains" of the operation. It receives the PDF and job description, parses the document using `pdfminer.six`, and orchestrates the AI logic using **LangChain** and **Pydantic** to force the LLM to return strict, predictable JSON structures.

---

## ⚙️ Key Features
* **Polyglot Microservices:** Seamless integration between JavaScript (Node/React) and Python environments.
* **Ephemeral File Processing:** Documents are processed securely in memory without ever being saved to a hard drive or database.
* **Deterministic AI Outputs:** Utilizes Pydantic schemas to strictly type the LLM response, preventing hallucinated formats and ensuring the React frontend always receives predictable data.
* **Cross-Origin Resource Sharing (CORS) Security:** Configured to strictly allow communication only between the deployed Vercel UI and Render backends.

---

## 💻 Local Setup & Installation

If you would like to run this application on your local machine, follow these steps:

### Prerequisites
* Node.js (v16+)
* Python (3.9+)
* A Google Gemini API Key

### 1. Clone the Repository
git clone [https://github.com/Rick23122003/Resume-Analyzer.git](https://github.com/Rick23122003/Resume-Analyzer.git)
cd Resume-Analyzer

### 2. Setup the AI Engine (Python)
cd ai-services
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

Create a .env file inside the ai-services folder:
GEMINI_API_KEY=your_google_ai_studio_api_key_here

Run the FastAPI server:
uvicorn main:app --reload

### 3. Setup the API Gateway (Node.js)
Open a new terminal window:
cd server
npm install

Create a .env file inside the server folder:
PORT=5001
PYTHON_ENGINE_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)

Run the Express server:
npm start

### 4. Setup the Frontend (React)
Open a third terminal window:
cd client
npm install

Create a .env file inside the client folder:
VITE_BACKEND_URL=http://localhost:5001

Run the Vite development server:
npm run dev

### Future Roadmap
•	Database Integration: Implementation of a MongoDB cluster to save user profiles and track historical match scores over time.
•	OAuth Authentication: Allow users to log in and save multiple tailored versions of their resumes.
Designed and built by 
Richik Ghosh
