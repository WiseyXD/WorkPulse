'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const JiraCallback = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  // Check if this component is running on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const code = params.get('code');
      const state = params.get('state');
      if (code && state) {
        const fetchAccessToken = async () => {
          try {
            const response = await axios.post('https://auth.atlassian.com/oauth/token', {
              grant_type: 'authorization_code',
              client_id: process.env.NEXT_PUBLIC_JIRA_CLIENT_ID,
              client_secret: process.env.NEXT_PUBLIC_JIRA_SECRET,
              code,
              redirect_uri: 'http://localhost:3000/jira-callback',
            });

            const { access_token } = response.data;
            console.log(access_token);
            localStorage.setItem('jiraAccessToken', access_token);
            router.push('/home');
          } catch (error) {
            console.error('Error fetching Jira access token:', error);
          }
        };

        fetchAccessToken();
      }
    }
  }, [isClient, router]);

  return <div>Processing Jira Authorization...</div>;
};

export default JiraCallback;
