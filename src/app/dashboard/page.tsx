'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jiraAccessToken');

    if (token) {
      const fetchProjects = async () => {
        try {
          const response = await axios.get(`https://api.atlassian.com/ex/jira/${process.env.NEXT_PUBLIC_JIRA_CLOUDID}/rest/api/3/project/search`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
          console.log(response);
          setProjects(response.data.values);
        } catch (error) {
          console.error('Error fetching Jira projects:', error);
        }
      };

      fetchProjects();
    }
  }, []);

  return (
    <div>
      <h1>Your Jira Projects</h1>
      <ul>
        {projects.map((project: any) => (
          <li key={project.id}>
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

