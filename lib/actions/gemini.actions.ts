"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  // responseMimeType: "text/plain",
  responseMimeType: "application/json",
}

async function askGemini(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  })

  const result = await chatSession.sendMessage(prompt)

  return result.response.text()
}

export async function generateSummary(jobTitle: string) {
  const prompt =
  jobTitle && jobTitle !== ""
    ? `Given the job title '${jobTitle}', provide a 2-3 line professional summary for three experience levels: Senior, Mid Level, and Fresher. Tailor each summary to reflect the responsibilities, skills, and expected contributions at each level. Return only a JSON array with 'experience_level' and 'summary' fields.`
    : `Create a 2-3 line professional summary for my resume. Include three stages of personal development: beginner, intermediate, and advanced. Focus on soft skills, professional attitude, and adaptability. Return only a JSON array with 'experience_level' and 'summary' fields, with no other output.`

  
  const result = await askGemini(prompt)

  return JSON.parse(result)
}



export async function generateEducationDescription(educationInfo: string) {
  const prompt = `Based on my education at ${educationInfo}, provide personal descriptions for three levels of curriculum activities: High Activity, Medium Activity, and Low Activity. Each description should be 2-3 lines long and written from my perspective, reflecting on past experiences. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. Please include a subtle hint about my good (but not the best) results.`

  const result = await askGemini(prompt)

  return JSON.parse(result)
}

export async function generateExperienceDescription(experienceInfo: string) {
  const prompt = `Given that I have experience working as ${experienceInfo}, provide a summary of three levels of activities I performed in that position, preferably as a list must be in  point 2-3: High Activity, Medium Activity, and Low Activity. Each summary should be 2-3 lines only and written from my perspective, reflecting on my past experiences in that workplace. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. You can include <b>, <i>, <u>, <s>, <blockquote>, <ul>, <ol>, and <li> to further enhance the descriptions. Use example work samples if needed, but do not insert placeholders for me to fill in.`

  const result = await askGemini(prompt)

  return JSON.parse(result)
}
export async function generateProjectDescription(projectInfo: string, technologies: string) {
  const prompt = `I have worked on a project titled "${projectInfo}", where I used technologies such as ${technologies || "various technologies"}.
Provide a summary of three levels of contributions I made to that project: High Activity, Medium Activity, and Low Activity. Each summary should be 2-3 lines only, written from my perspective, and should highlight my technical role, challenges solved, and project outcomes.
The output should be a JSON array, each item containing 'activity_level' and 'description' fields. You can include HTML tags such as <b>, <i>, <u>, <s>, <blockquote>, <ul>, <ol>, and <li> to enhance formatting. Avoid placeholders—include meaningful, realistic contributions and results.`

  const result = await askGemini(prompt)

  return JSON.parse(result)
}

