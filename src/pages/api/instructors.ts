import { listInstructors, setInstructorImage } from '../../lib/instructorProfiles';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function cleanSlug(s: unknown) {
  return String(s || '').trim().replace(/[\\/]/g, '').replace(/\s+/g, '-');
}

export async function GET() {
  try {
    const instructors = await listInstructors();
    return json(instructors);
  } catch (error) {
    console.error('[API] Error reading instructors:', error);
    return json({ error: 'Failed to read instructors' }, 500);
  }
}

export async function PUT({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const slug = cleanSlug(body.slug);
    if (!slug) return json({ error: 'Instructor slug is required' }, 400);

    const image = typeof body.image === 'string' ? body.image.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : undefined;

    if (image && !/^https?:\/\//i.test(image)) {
      return json({ error: 'Image must be a valid http(s) URL' }, 400);
    }

    const profile = await setInstructorImage(slug, image, name);
    return json(profile);
  } catch (error) {
    console.error('[API] Error updating instructor:', error);
    return json({ error: 'Failed to update instructor' }, 500);
  }
}
