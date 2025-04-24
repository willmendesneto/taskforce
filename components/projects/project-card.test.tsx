import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ProjectCard } from '@/components/projects/project-card';

// Mock project data
const mockProject = {
  id: 1,
  title: 'Test Project',
  description: 'This is a test project',
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  tasks: [
    {
      id: 1,
      title: 'Task 1',
      description: 'Test task',
      status: 'todo' as const,
      projectId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Test task in progress',
      status: 'in_progress' as const,
      projectId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date(),
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Test task done',
      status: 'done' as const,
      projectId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
    },
  ],
};

// Mock empty project
const emptyProject = {
  ...mockProject,
  tasks: [],
};

describe('ProjectCard Component', () => {
  it('renders project title and description', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project')).toBeInTheDocument();
  });

  it('calculates and displays correct completion percentage', () => {
    render(<ProjectCard project={mockProject} />);

    // 1 done task out of 3 total tasks = 33%
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('displays total number of tasks', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('3 tasks')).toBeInTheDocument();
  });

  it('shows 0% progress for projects with no tasks', () => {
    render(<ProjectCard project={emptyProject} />);

    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('0 tasks')).toBeInTheDocument();
  });

  it('displays "No description" for projects without a description', () => {
    const noDescProject = { ...mockProject, description: null };
    render(<ProjectCard project={noDescProject} />);

    expect(screen.getByText('No description')).toBeInTheDocument();
  });
});
