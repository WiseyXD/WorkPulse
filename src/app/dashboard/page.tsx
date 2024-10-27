'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import crypto from 'crypto';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  // best thing to do was to lose
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('jiraAccessToken');
    console.log(token);
    if (!token) {
      router.push("/jira");
    }
    if (token) {
      const fetchProjects = async () => {
        try {
          const response = await fetch('/api/jiraSummary', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log(data);
          //@ts-ignore
          setProjects(data.projects);
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
        {projects?.map((project: any) => (
          <li key={project.id}>
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

