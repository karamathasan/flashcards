import { NextResponse } from "next/server";
import OpenAI from "openai";
import dotenv from 'dotenv'
dotenv.config();

// const systemPrompt = `
// You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
// Both front and back should be one sentence long.
// You should return in the following JSON format:
// {
//   "flashcards":[
//     {
//       "front": "Front of the card",
//       "back": "Back of the card"
//     }
//   ]
// }
// `
function createPrompt(numFlashcards){
  return `
    You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly ${numFlashcards} flashcards.
    Both front and back should be one sentence long. 
    You should return in the following JSON format:
    {
      "flashcards":[
        {
          "front": "Front of the card",
          "back": "Back of the card"
        }
      ]
    }
    `
}

export async function POST(req) {
  const openai = new OpenAI(process.env.OPENAI_API_KEY)
  const data = await req.json()
  const numFlashcards = data.numFlashcards
  const message = data.message
  const prompt = createPrompt(numFlashcards)
  
  try{
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }, data.message],
      model: 'gpt-3.5-turbo',
      stream: false,
    })

    return NextResponse.json({completion: completion.choices[0].message.content})
  } catch (e){
    return NextResponse.json({error:e.message})
  }
}

