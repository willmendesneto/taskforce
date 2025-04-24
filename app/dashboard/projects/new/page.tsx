import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { ProjectForm } from '@/components/projects/project-form';
import { authOptions } from '@/lib/auth';

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-6 px-4">
      <div>
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">Add a new project to organize your tasks</p>
      </div>
      <ProjectForm />
    </div>
  );
}
