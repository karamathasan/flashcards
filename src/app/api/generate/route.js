import { NextResponse } from "next/server";
import OpenAI from "openai";
dotenv.config();

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
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
export async function POST(req) {
  const openai = new OpenAI(process.env.OPENAI_API_KEY)
  const data = await req.json()
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data],
    model: 'gpt-3.5-turbo',
    stream: false,
  })
  // const stream = new ReadableStream({
  //   async start(controller) {
  //     const encoder = new TextEncoder()
  //     try {
  //       for await (const chunk of completion) {
  //         const content = chunk.choices[0]?.delta?.content
  //         if (content) {
  //           const text = encoder.encode(content)
  //           controller.enqueue(text)
  //         }
  //       }
  //     } catch (err) {
  //       controller.error(err)
  //     } finally {
  //       controller.close()
  //     }

  //   }
  // })
  // return new NextResponse(stream)
}