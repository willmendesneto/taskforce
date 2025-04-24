'use client';

import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { TaskDialog } from '@/components/tasks/task-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function updateTaskStatus(status: 'todo' | 'in_progress' | 'done') {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update task');
      }

      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteTask() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete task');
      }

      toast({
        title: 'Task deleted',
        description: 'Your task has been deleted successfully.',
      });

      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const statusStyles = {
    todo: '',
    in_progress: 'border-l-4 border-blue-500',
    done: 'opacity-60',
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm',
          statusStyles[task.status],
        )}
      >
        <div className="flex items-center gap-2">
          <Checkbox
            checked={task.status === 'done'}
            onCheckedChange={checked => {
              updateTaskStatus(checked ? 'done' : 'todo');
            }}
            disabled={isLoading}
          />
          <span className={cn('text-sm font-medium', task.status === 'done' && 'line-through')}>
            {task.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {task.status === 'todo' && 'To Do'}
            {task.status === 'in_progress' && 'In Progress'}
            {task.status === 'done' && 'Done'}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isLoading}>
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {task.status !== 'todo' && (
                <DropdownMenuItem onClick={() => updateTaskStatus('todo')}>
                  Set to To Do
                </DropdownMenuItem>
              )}
              {task.status !== 'in_progress' && (
                <DropdownMenuItem onClick={() => updateTaskStatus('in_progress')}>
                  Set to In Progress
                </DropdownMenuItem>
              )}
              {task.status !== 'done' && (
                <DropdownMenuItem onClick={() => updateTaskStatus('done')}>
                  Set to Done
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={deleteTask}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TaskDialog task={task} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
