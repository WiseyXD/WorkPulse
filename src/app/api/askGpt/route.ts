
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
    // const cloudId = process.env.NEXT_PUBLIC_JIRA_CLOUDID;
    // const authHeader = request.headers.get('Authorization');
    // if (!authHeader) {
    //     return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
    // }

    // const token = authHeader.split(' ')[1]; // Extract the token cloudId = process.env.NEXT_PUBLIC_JIRA_CLOUDID;
    // console.log(token);
    try {
        // Parse the incoming request to get the user's prompt and channel ID
        const { prompt, channelId } = await request.json();

        if (!prompt || !channelId) {
            return NextResponse.json(
                { error: 'Both prompt and channelId are required' },
                { status: 400 }
            );
        }

        // Step 1: Fetch messages from Slack
        const slackResult = await slackClient.conversations.history({
            channel: channelId,
            limit: 30,
        });

        if (!slackResult.ok || !slackResult.messages) {
            throw new Error(`Error fetching messages: ${slackResult.error}`);
        }

        // Map messages to a simplified structure and fetch usernames
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

        //         const jiraResponse = await axios.get(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/search`, {
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //                 Accept: 'application/json',
        //             },
        //         });

        //         if (!jiraResponse.ok) {
        //             throw new Error('Error fetching Jira issues');
        //         }

        //         const jiraData = await jiraResponse.json();
        //         console.log(jiraData);
        //         const issues = jiraData.issues.map((issue: any) => ({
        //             key: issue.key,
        //             summary: issue.fields.summary,
        //             status: issue.fields.status.name,
        //         }));

        //         console.log(issues)
        // Step 2: Send the Slack messages and user prompt to ChatGPT
        const chatMessages = [
            {
                role: 'system',
                content: 'You are an AI assistant that provides insights based on Slack messages.',
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
