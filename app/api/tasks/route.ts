import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { tasks, projects, type NewTask } from '@/lib/db/schema';
import { taskSchema } from '@/lib/schemas';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number.parseInt(session.user.id);
    const { searchParams } = new URL(req.url);
    const projectIdParam = searchParams.get('projectId');

    let projectId: number | undefined;
    if (projectIdParam) {
      projectId = Number.parseInt(projectIdParam);
      if (isNaN(projectId)) {
        return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
      }
    }

    // First, get the projects that belong to the user
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.userId, userId),
      columns: {
        id: true,
      },
    });

    const projectIds = userProjects.map(project => project.id);

    if (projectIds.length === 0) {
      return NextResponse.json([]);
    }

    // Then, get tasks that belong to those projects
    const query = and(
      projectIds.length > 0
        ? projectId
          ? eq(tasks.projectId, projectId)
          : eq(tasks.projectId, projectIds[0])
        : undefined,
    );

    const userTasks = await db.query.tasks.findMany({
      where: query,
      orderBy: (tasks, { desc }) => [desc(tasks.updatedAt)],
    });

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number.parseInt(session.user.id);
    const body = await req.json();

    // Validate request body
    const result = taskSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 },
      );
    }

    const { title, description, status, dueDate, projectId } = result.data;

    // Check if project exists and belongs to user
    const project = await db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    // Create task
    const newTask: NewTask = {
      title,
      description: description || null,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
    };

    const createdTask = await db.insert(tasks).values(newTask).returning();

    return NextResponse.json(createdTask[0], { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
