from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
from dotenv import load_dotenv
import tempfile
import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List

load_dotenv()

app = FastAPI(title="Resume AI Engine with LangChain")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactInfo(BaseModel):
    email: str = Field(description="The candidate's email address, or 'Not Found'")
    phone: str = Field(description="The candidate's phone number, or 'Not Found'")

# Updated Data Model to include Scoring
class ResumeAnalysis(BaseModel):
    name: str = Field(description="The candidate's full name")
    contact: ContactInfo
    skills: List[str] = Field(description="A clean array of technical and soft skills found in the resume")
    experience_summary: str = Field(description="A concise 2-sentence summary of their work experience")
    match_score: int = Field(description="A score from 0 to 100 representing how well the resume fits the Job Description")
    matching_skills: List[str] = Field(description="Skills required by the job that the candidate possesses")
    missing_skills: List[str] = Field(description="Crucial skills required by the job that are missing from the resume")

parser = PydanticOutputParser(pydantic_object=ResumeAnalysis)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", # Using the active model!
    api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0 
)

# Updated Prompt to include Job Description logic
prompt_template = PromptTemplate(
    template="""
    You are an expert Applicant Tracking System (ATS) and Senior Technical Recruiter. 
    Analyze the following resume text against the provided Job Description.
    
    Calculate a harsh, realistic 'match_score' (0-100) based on how well their skills and experience 
    align with the job requirements. Be strictly analytical.
    
    {format_instructions}
    
    Job Description:
    {job_description}
    
    Resume Text:
    {resume_text}
    """,
    input_variables=["resume_text", "job_description"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

chain = prompt_template | llm | parser

# Note: Added 'job_description: str = Form(...)' to the parameters
@app.post("/api/extract")
async def extract_resume_text(
    file: UploadFile = File(...),
    job_description: str = Form(...) 
):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            content = await file.read()
            temp_pdf.write(content)
            temp_path = temp_pdf.name

        raw_text = extract_text(temp_path)
        os.remove(temp_path)

        # Pass BOTH the resume text and the job description to LangChain
        parsed_result = chain.invoke({
            "resume_text": raw_text.strip(),
            "job_description": job_description.strip()
        })

        return {
            "status": "success",
            "filename": file.filename,
            "analysis": parsed_result.model_dump() 
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}