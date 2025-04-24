import { and, eq } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { ProjectForm } from '@/components/projects/project-form';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = Number.parseInt(session.user.id);
  const projectId = Number.parseInt((await params).id);

  if (isNaN(projectId)) {
    notFound();
  }

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground">Update your project details</p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
