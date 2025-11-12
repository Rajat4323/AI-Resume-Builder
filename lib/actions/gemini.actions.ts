"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// ✅ Initialize Gemini API (v1 ensures correct versioning)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// ✅ Use the latest supported model
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
})

// ✅ Config for consistent generation
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
}

// ✅ Safe JSON parser to handle invalid model output
function safeJSONParse(text: string) {
  try {
    const cleaned = text
      .replace(/```json|```/g, "") // remove markdown fences
      .replace(/^[^{[]+/, "") // remove text before JSON
      .replace(/[^}\]]+$/, "") // remove text after JSON
      .trim()

    return JSON.parse(cleaned)
  } catch (error) {
    console.error("❌ Failed to parse JSON. Raw output:\n", text)
    throw new Error("Invalid JSON returned from Gemini")
  }
}

// ✅ Core function to send a prompt to Gemini
async function askGemini(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  })

  const result = await chatSession.sendMessage(prompt)
  return result.response.text()
}

// ✅ Generate Summary
export async function generateSummary(jobTitle: string, existingSummary?: string) {
  if (existingSummary && existingSummary.trim() !== "") {
    // Enhancement mode: Polish existing text
    const enhancementPrompt = `You are a professional resume editor. The user has provided the following summary text:

"${existingSummary}"

Please enhance and polish this text to make it more professional and impactful while:
- Retaining the original meaning and all user-provided keywords
- Improving grammar, tone, clarity, and structure
- Making it sound more professional and impactful
- Keeping factual details intact
- You can include any relevant text by yourself to make it 2-3 lines but keep the original details provided by the user

Return ONLY a JSON object with a single field 'summary' containing the enhanced text. Do not include any other fields or explanations.`

    const result = await askGemini(enhancementPrompt)
    const parsed = safeJSONParse(result)
    return [{ summary: parsed.summary, isEnhanced: true }]
  }

  // Generation mode: Create suggestions with difficulty levels
  const prompt =
    jobTitle && jobTitle !== ""
      ? `Given the job title '${jobTitle}', provide a 1-2 line professional summary for three experience levels: Fresher, Mid Level, and Senior. Tailor each summary to reflect the responsibilities, skills, and expected contributions at each level and please keep it concise too. Return only a JSON array with 'experience_level' and 'summary' fields.`
: `Create a 1-2 line professional summary for my resume. Include three stages of personal development: Fresher, Mid Level, and Senior. Focus on soft skills, conciseness, professional attitude, and adaptability. Return only a JSON array with 'experience_level' and 'summary' fields, with no other output.`

  const result = await askGemini(prompt)
  return safeJSONParse(result)
}

// ✅ Generate Education Description
export async function generateEducationDescription(educationInfo: string, existingDescription?: string) {
  if (existingDescription && existingDescription.trim() !== "") {
    // Enhancement mode: Polish existing text
    const enhancementPrompt = `You are a professional resume editor. The user has provided the following education description:

"${existingDescription}"

Please enhance and polish this text to make it more professional and impactful while:
- Retaining the original meaning and all user-provided keywords and details
- Improving grammar, tone, clarity, and structure
- Making it sound more professional
- Keeping factual details intact
- You can include any relevant text by yourself to make it 2-3 lines but keep the original details provided by the user

Return ONLY a JSON array with a single object containing 'description' and 'isEnhanced' fields. No other output.`

    const result = await askGemini(enhancementPrompt)
    const parsed = safeJSONParse(result)
    return Array.isArray(parsed) ? parsed : [{ description: parsed.description, isEnhanced: true }]
  }

  // Generation mode: Create suggestions with activity levels
  const prompt = `Based on my education at ${educationInfo}, provide personal descriptions for three levels of curriculum activities: High Activity, Medium Activity, and Low Activity. Each description should be 2-3 lines long and written from my perspective, reflecting on past experiences. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. Please include a subtle hint about my good (but not the best) results.`

  const result = await askGemini(prompt)
  return safeJSONParse(result)
}

// ✅ Generate Experience Description
export async function generateExperienceDescription(experienceInfo: string, existingDescription?: string) {
  if (existingDescription && existingDescription.trim() !== "") {
    // Enhancement mode: Polish existing text
    const enhancementPrompt = `You are a professional resume editor. The user has provided the following work experience description:

"${existingDescription}"

Please enhance and polish this text to make it more professional and impactful while:
- Retaining the original meaning and all user-provided keywords and technical details
- Improving grammar, tone, clarity, and structure
- Making it sound more professional, concise, and achievement-focused
- Keeping factual details intact
- You can include any relevant text by yourself to make it 2-3 lines but keep the original details provided by the user
- You must include HTML tags <ul>, <li> to format the description as a list


Return ONLY a JSON array with a single object containing 'description' and 'isEnhanced' fields. No other output.`

    const result = await askGemini(enhancementPrompt)
    const parsed = safeJSONParse(result)
    return Array.isArray(parsed) ? parsed : [{ description: parsed.description, isEnhanced: true }]
  }

  // Generation mode: Create suggestions with activity levels
  const prompt = `Given that I have experience working as ${experienceInfo}, provide a summary of three levels of activities I performed in that position, preferably as a list in point form (2-3 points): High Activity, Medium Activity, and Low Activity. Each summary should be 2-3 lines only and written from my perspective, reflecting on my past experiences. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. You must include <ul> and <li> tags to enhance the descriptions. Use example work samples if needed, but do not insert placeholders.`

  const result = await askGemini(prompt)
  return safeJSONParse(result)
}

// ✅ Generate Project Description
export async function generateProjectDescription(
  projectInfo: string,
  technologies: string,
  existingDescription?: string,
) {
  if (existingDescription && existingDescription.trim() !== "") {
    // Enhancement mode: Polish existing text
    const enhancementPrompt = `You are a professional resume editor. The user has provided the following project description:

"${existingDescription}"

Please enhance and polish this text to make it more professional and impactful while:
- Retaining the original meaning and all user-provided keywords, technical details, and outcomes
- Improving grammar, tone, clarity, and structure
- Making it sound more professional, concise, and achievement-focused
- Highlighting technical contributions and results
- Keeping factual details intact
- You can include any relevant text by yourself to make it 2-3 lines but keep the original details provided by the user
- You must include HTML tags <ul>, <li> to format the description as a list



Return ONLY a JSON array with a single object containing 'description' and 'isEnhanced' fields. No other output.`

    const result = await askGemini(enhancementPrompt)
    const parsed = safeJSONParse(result)
    return Array.isArray(parsed) ? parsed : [{ description: parsed.description, isEnhanced: true }]
  }

  // Generation mode: Create suggestions with activity levels
  const prompt = `I have worked on a project titled "${projectInfo}", where I used technologies such as ${technologies || "various technologies"}.
Provide a summary of three levels of contributions I made to that project: High Activity, Medium Activity, and Low Activity. Each summary should be 2-3 lines only, written from my perspective, and should highlight my technical role, challenges solved, and project outcomes.
The output should be a JSON array, each item containing 'activity_level' and 'description' fields. You must include HTML tags such as <ul> and <li> to enhance formatting. Avoid placeholders—include meaningful, realistic contributions and results.`

  const result = await askGemini(prompt)
  return safeJSONParse(result)
}
