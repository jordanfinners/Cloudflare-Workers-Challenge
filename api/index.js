const corsHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Origin': 'https://cloudflare-challenge-ui.finners.workers.dev',
};

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (!['GET', 'POST'].includes(request.method)) {
    return new Response(null, {
      status: 405,
      headers: corsHeaders,
    });
  }

  const location = request.cf.colo;

  if (request.method === 'POST') {
    try {
      const existingEvents = await EVENTS.get(location, 'json') || [];
      const newEvent = await request.json();
      await EVENTS.put(location, JSON.stringify([...existingEvents, newEvent]));
      return new Response(null, {
        status: 201,
        headers: {'content-type': 'application/json', ...corsHeaders},
      });
    } catch (e) {
      console.log(e);
      return new Response(JSON.stringify(e), {
        status: 500,
        headers: {'content-type': 'application/json', ...corsHeaders},
      });
    }
  }

  if (request.method === 'GET') {
    try {
      const existingEvents = await EVENTS.get(location);
      return new Response(existingEvents, {
        status: 200,
        headers: {'content-type': 'application/json', ...corsHeaders},
      });
    } catch (e) {
      console.log(e);
      return new Response(JSON.stringify(e), {
        status: 500,
        headers: {'content-type': 'application/json', ...corsHeaders},
      });
    }
  }
}
