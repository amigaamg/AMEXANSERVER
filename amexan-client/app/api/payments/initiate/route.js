export async function POST(req) {
  return new Response(JSON.stringify({ message: 'Initiate endpoint (placeholder)' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}