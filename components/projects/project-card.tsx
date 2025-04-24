import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project, Task } from '@/lib/db/schema';

interface ProjectCardProps {
  project: Project & {
    tasks: Task[];
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Count tasks by status
  const taskCounts = {
    total: project.tasks.length,
    todo: project.tasks.filter(task => task.status === 'todo').length,
    inProgress: project.tasks.filter(task => task.status === 'in_progress').length,
    done: project.tasks.filter(task => task.status === 'done').length,
  };

  // Calculate completion percentage
  const completionPercentage =
    taskCounts.total > 0 ? Math.round((taskCounts.done / taskCounts.total) * 100) : 0;

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description || 'No description'}
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Badge variant="outline">{taskCounts.total} tasks</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
