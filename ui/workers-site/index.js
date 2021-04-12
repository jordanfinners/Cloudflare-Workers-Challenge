import {getAssetFromKV} from '@cloudflare/kv-asset-handler';

addEventListener('fetch', (event) => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    event.respondWith(new Response('Internal Error', {status: 500}));
  }
});

async function handleEvent(event) {
  const options = {};
  try {
    const page = await getAssetFromKV(event, options);
    // allow headers to be altered
    const response = new Response(page.body, page);
    response.headers.set('Server', 'Cloudflare Workers Challenge');
    response.headers.set('Cache-Control', 'public, s-maxage=86400');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('Referrer-Policy', 'same-origin');
    response.headers.set('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(),payment=(), usb=()');
    response.headers.set('Content-Security-Policy', `default-src 'none'; script-src 'self' https://static.cloudflareinsights.com; img-src 'self' https://jordanfinners.dev; style-src 'self'; connect-src 'self' https://cloudflareinsights.com https://cloudflare-challenge-api.finners.workers.dev; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';`);
    return response;
  } catch (e) {
    try {
      const notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: (req) => new Request(`${new URL(req.url).origin}/404.html`, req),
      });

      return new Response(notFoundResponse.body, {...notFoundResponse, status: 404});
    } catch (e) {
      return new Response('Internal Error', {status: 500});
    }
  }
}
