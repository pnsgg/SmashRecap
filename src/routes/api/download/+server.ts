import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const fileUrl = url.searchParams.get('url');
  if (!fileUrl) {
    throw error(400, 'Missing url');
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw error(response.status, 'Failed to fetch remote file');
    }

    // Create headers for the response
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');

    // Stream backend response directly to client
    return new Response(response.body, {
      status: 200,
      headers
    });
  } catch (err) {
    console.error('Proxy download failed:', err);
    throw error(500, 'Error downloading file');
  }
};
