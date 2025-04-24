'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { TaskCard } from '@/components/tasks/task-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task } from '@/lib/db/schema';

interface TaskListProps {
  tasks: Task[];
}

type TaskStatus = 'all' | 'todo' | 'in_progress' | 'done';

export function TaskList({ tasks }: TaskListProps) {
  const [filter, setFilter] = useState<TaskStatus>('all');
  const router = useRouter();

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by status priority: todo, in_progress, done
    const statusPriority = { todo: 0, in_progress: 1, done: 2 };
    const statusA = statusPriority[a.status as keyof typeof statusPriority];
    const statusB = statusPriority[b.status as keyof typeof statusPriority];

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    // Then sort by updated date (newest first)
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={filter} onValueChange={value => setFilter(value as TaskStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedTasks.length > 0 ? (
        <div className="space-y-2">
          {sortedTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] w-full items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center space-y-2 text-center">
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === 'all'
                ? 'Add your first task to get started.'
                : `No ${filter.replace('_', ' ')} tasks found.`}
            </p>
          </div>
        </div>
      )}

      <Button
        className="flex items-center justify-center rounded-lg border p-4 shadow-sm w-full text-center"
        type="button"
        onClick={() => router.push('/dashboard')}
      >
        Cancel
      </Button>
    </div>
  );
}
