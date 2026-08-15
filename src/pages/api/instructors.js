import { readInstructors, writeInstructors } from '../../lib/store.js';
import { createInstructorSlug } from '../../lib/instructors.js';

export async function GET() {
  try {
    const instructors = await readInstructors();
    return new Response(JSON.stringify(instructors), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch instructors' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT({ request }) {
  try {
    const body = await request.json();
    const slug = body.slug || createInstructorSlug(body.name || '');
    const name = String(body.name || '').trim();
    const image = typeof body.image === 'string' ? body.image.trim() : '';

    if (!name) {
      return new Response(JSON.stringify({ error: 'Instructor name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const instructors = await readInstructors();
    const key = createInstructorSlug(slug);

    instructors[key] = { name };
    if (image) {
      instructors[key].image = image;
    }

    await writeInstructors(instructors);

    return new Response(JSON.stringify({ success: true, instructor: instructors[key], slug: key }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving instructor:', error);
    return new Response(JSON.stringify({ error: 'Failed to save instructor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE({ request }) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return new Response(JSON.stringify({ error: 'Instructor slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const instructors = await readInstructors();
    delete instructors[createInstructorSlug(slug)];
    await writeInstructors(instructors);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete instructor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
