
// /app/api/get-jira-summary/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    try {
        const cloudId = process.env.NEXT_PUBLIC_JIRA_CLOUDID;
        const response = await axios.get(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/search`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });
        const projects = response.data.values.map((project: any) => ({
            id: project.id,
            name: project.name,
            key: project.key,
        }));
        console.log(projects);
        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Error fetching Jira data:', error);
        return NextResponse.json({ error: 'Failed to fetch Jira data' }, { status: 500 });
    }
}
