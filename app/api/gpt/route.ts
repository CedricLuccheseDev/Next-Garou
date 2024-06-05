import { NextApiResponse } from 'next';
import { openai } from '@/lib/gpt';

export async function POST(req: Request, res: NextApiResponse) {

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'user', content: 'You are a narrator of Werewolf game. introduce a party with an original story.' },
                // { role: 'user', content: prompt }
            ],
            max_tokens: 50
        });

        const narration = response.choices[0].message?.content;
        return new Response(JSON.stringify({ message: narration }));
    } catch (error) {
        console.error('Error fetching narration:', error);
    }
}
