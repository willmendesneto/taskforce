import { and, eq } from 'drizzle-orm';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { DeleteProject } from '@/components/projects/delete-project';
import { TaskForm } from '@/components/tasks/task-form';
import { TaskList } from '@/components/tasks/task-list';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const userId = Number.parseInt(session.user.id);
  const projectId = Number.parseInt(id);

  if (isNaN(projectId)) {
    notFound();
  }

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    with: {
      tasks: true,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground">{project.description || 'No description'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/projects/${project.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteProject id={project.id} />
        </div>
      </div>

      <div className="space-y-4 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Tasks</h2>
        </div>

        <TaskForm projectId={project.id} />

        <TaskList tasks={project.tasks} />
      </div>
    </div>
  );
}
