import { WebClient } from '@slack/web-api';
import { NextResponse } from 'next/server';

const token = process.env.SLACK_BOT;
const client = new WebClient(token);

export async function GET(request: any) {
    // Get the channelId from the request URL
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');

    if (!channelId) {
        return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
    }

    try {
        const result = await client.conversations.history({
            channel: channelId,
            limit: 100,
        });

        if (result.ok) {
            // Cache for storing user info to reduce API calls
            const userCache: Record<string, string> = {};

            // Map over messages and fetch usernames
            const messages = await Promise.all(
                result.messages.map(async (message: any) => {
                    const userId = message.user;
                    let username = userCache[userId];

                    if (!username) {
                        try {
                            const userInfo = await client.users.info({ user: userId });
                            username = userInfo.user?.name || 'Unknown User';
                            userCache[userId] = username; // Cache the username
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
            console.log(messages)
            return NextResponse.json({ messages });
        } else {
            console.error('Error fetching messages:', result.error);
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
