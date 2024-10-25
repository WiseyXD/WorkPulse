import { OpenAI } from 'openai';// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});// Define the POST handler for the API route
export async function POST(req: Request): Promise<Response> {
    try {
        const { prompt } = await req.json() as { prompt: string }; // Parse the request body    // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
        });    // Return the response from OpenAI
        return new Response(JSON.stringify({ result: response.choices[0].message.content }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        // Handle errors and return appropriate response
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
