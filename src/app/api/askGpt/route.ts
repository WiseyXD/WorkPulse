
import { WebClient } from '@slack/web-api';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';// Initialize the OpenAI client
import axios from "axios";
const slackToken = process.env.SLACK_BOT;
const slackClient = new WebClient(slackToken);
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});
export async function POST(request: Request) {
    try {
        const { prompt, channelId } = await request.json();

        if (!prompt || !channelId) {
            return NextResponse.json(
                { error: 'Both prompt and channelId are required' },
                { status: 400 }
            );
        }

        const slackResult = await slackClient.conversations.history({
            channel: channelId,
            limit: 30,
        });

        if (!slackResult.ok || !slackResult.messages) {
            throw new Error(`Error fetching messages: ${slackResult.error}`);
        }

        const userCache: Record<string, string> = {};
        const messages = await Promise.all(
            slackResult.messages.map(async (message: any) => {
                const userId = message.user;
                let username = userCache[userId];

                if (!username) {
                    try {
                        const userInfo = await slackClient.users.info({ user: userId });
                        username = userInfo.user?.name || 'Unknown User';
                        userCache[userId] = username;
                    } catch (error) {
                        console.error(`Error fetching user info for ${userId}:`, error);
                        username = 'Unknown User';
                    }
                }

                return {
                    text: message.text,
                    sender: username,
                    timestamp: message.ts,
                };
            })
        );

        const chatMessages = [
            {
                role: 'system',
                content: 'You are an AI assistant that provides insights based on Slack messages and Jira issues and boards, do support multilingual feature and if and only if there is a prompt where the user is saying to push a message in slack channel or add a card/issue in jira or trello then return a prompt saying that ":the task you requested is done." ',
            },
            {
                role: 'user',
                content: `Here are recent messages from the Slack channel: ${JSON.stringify(messages)}`,
            },
            {
                role: 'user',
                content: prompt,
            },
        ];

        const gptResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            // @ts-ignore
            messages: chatMessages,
            max_tokens: 100,
        });

        const responseContent = gptResponse.choices[0]?.message?.content || 'No response from ChatGPT.';
        console.log(responseContent);
        return NextResponse.json({ response: responseContent });

    } catch (error) {
        console.error('Error in askGpt API:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
