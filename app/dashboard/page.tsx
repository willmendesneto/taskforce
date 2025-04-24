import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { ProjectCard } from '@/components/projects/project-card';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = Number.parseInt(session.user.id);

  // Get recent projects
  const recentProjects = await db.query.projects.findMany({
    where: (projects, { eq }) => eq(projects.userId, userId),
    orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
    limit: 4,
    with: {
      tasks: true,
    },
  });

  // Get task counts by status
  const taskCounts = {
    total: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
  };

  for (const project of recentProjects) {
    for (const task of project.tasks) {
      taskCounts.total++;
      if (task.status === 'todo') taskCounts.todo++;
      if (task.status === 'in_progress') taskCounts.inProgress++;
      if (task.status === 'done') taskCounts.done++;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Tasks</h3>
          </div>
          <div className="text-2xl font-bold">{taskCounts.total}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">To Do</h3>
          </div>
          <div className="text-2xl font-bold">{taskCounts.todo}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">In Progress</h3>
          </div>
          <div className="text-2xl font-bold">{taskCounts.inProgress}</div>
        </div>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Completed</h3>
          </div>
          <div className="text-2xl font-bold">{taskCounts.done}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold px-4">Recent Projects</h2>
          <Link href="/dashboard/projects">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        {recentProjects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center rounded-lg border border-dashed">
            <div className="flex flex-col items-center space-y-2 text-center">
              <h3 className="text-lg font-medium">No projects yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first project to get started.
              </p>
              <Link href="/dashboard/projects/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
