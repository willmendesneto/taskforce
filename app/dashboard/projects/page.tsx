import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

import { ProjectCard } from '@/components/projects/project-card';
import { ProjectSearch } from '@/components/projects/project-search';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = Number.parseInt(session.user.id);
  const search = (await searchParams).search || '';

  // Get projects with search filter
  const projects = await db.query.projects.findMany({
    where: (projects, { eq, and, or, like }) => {
      const baseQuery = eq(projects.userId, userId);

      if (search) {
        return and(
          baseQuery,
          or(like(projects.title, `%${search}%`), like(projects.description || '', `%${search}%`)),
        );
      }

      return baseQuery;
    },
    orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
    with: {
      tasks: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <ProjectSearch />

      {projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] w-full items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3 className="text-lg font-medium">
              {search ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {search ? 'Try a different search term' : 'Create your first project to get started.'}
            </p>
            {!search && (
              <Link href="/dashboard/projects/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
