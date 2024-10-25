import { WebClient } from '@slack/web-api';
import { NextResponse } from 'next/server';// Your Slack OAuth token (use environment variables for security)
const token = process.env.SLACK_BOT;
const client = new WebClient(token);
export async function GET(request: any) {
    // Get the channelId from the request URL
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    if (!channelId) {
        return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
    } try {
        const result = await client.conversations.history({
            channel: channelId,
        });
        return NextResponse.json({ messages: result.messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}
