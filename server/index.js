import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors()); 
app.use(express.json()); 

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('Resume Analyzer API Gateway is running.');
});

app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract the job description from the request body (default to a fallback string if empty)
    const jobDescription = req.body.jobDescription || "Analyze this resume generally without a specific job description.";
    
    console.log(`Node Gateway received: ${req.file.originalname}. Forwarding to AI engine...`);

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    // Append the text data to the form
    formData.append('job_description', jobDescription);

    const pythonResponse = await axios.post('http://127.0.0.1:8000/api/extract', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    res.status(200).json({ 
      message: 'Successfully processed by AI Engine', 
      data: pythonResponse.data 
    });

  } catch (error) {
    console.error('Error forwarding to Python:', error.message);
    res.status(500).json({ error: 'Internal server error processing the file' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});