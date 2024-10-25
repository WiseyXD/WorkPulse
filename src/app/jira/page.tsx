'use client';
import crypto from 'crypto';
const JiraButton = () => {
  const handleJiraAuth = () => {
    // Generate a random state parameter
    const state = crypto.randomBytes(16).toString('hex');

    // Save the state in localStorage or cookie for validation later
    localStorage.setItem('jiraAuthState', state);

    const clientId = process.env.NEXT_PUBLIC_JIRA_CLIENT_ID;
    const redirectUri = encodeURIComponent('http://localhost:3000/jira-callback');
    const scopes = encodeURIComponent(
      'read:jira-work manage:jira-project manage:jira-configuration read:jira-user write:jira-work manage:jira-webhook manage:jira-data-provider'
    );

    // Redirect to Jira OAuth authorization URL with the generated state
    const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}&response_type=code&prompt=consent`;

    window.location.href = authUrl;
  };

  return (
    <button onClick={handleJiraAuth} className="bg-blue-500 text-white p-3 rounded">
      Connect with Jira
    </button>
  );
};

export default JiraButton;
