import { and, eq, like, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { projects, type NewProject } from '@/lib/db/schema';
import { projectSchema } from '@/lib/schemas';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number.parseInt(session.user.id);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let query = and(eq(projects.userId, userId));

    if (search) {
      query = and(
        query,
        or(like(projects.title, `%${search}%`), like(projects.description || '', `%${search}%`)),
      );
    }

    const userProjects = await db.query.projects.findMany({
      where: query,
      orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
      with: {
        tasks: true,
      },
    });

    return NextResponse.json(userProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
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
    const result = projectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 },
      );
    }

    const { title, description } = result.data;

    // Create project
    const newProject: NewProject = {
      title,
      description: description || null,
      userId,
    };

    const createdProject = await db.insert(projects).values(newProject).returning();

    return NextResponse.json(createdProject[0], { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
