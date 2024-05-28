import OpenAI from 'openai';

const OpenAIKey = process.env.OPENAI_API_KEY;

if (!OpenAIKey) {
    throw new Error('OPENAI_API_KEY not defined');
}

export const openai = new OpenAI({
    apiKey: OpenAIKey
});