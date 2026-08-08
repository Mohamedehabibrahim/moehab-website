export default {
  async fetch(request, env) {
    const accept = request.headers.get('Accept') || '';
    const url = new URL(request.url);
    const path = url.pathname;

    // Markdown Negotiation
    if (accept.includes('text/markdown') && path === '/') {
      const markdown = `# MO EHAB ADS — Mohamed Ehab

Paid Advertising Specialist | Saudi Arabia & Egypt

## Services
- Meta Ads from 600 SAR/month
- Google Ads from 600 SAR/month  
- AI Marketing Plan: moehabads.com/plan

## Contact
WhatsApp: +966580395350
Email: mr.mohammedihab@gmail.com
`;
      return new Response(markdown, {
        headers: { 'Content-Type': 'text/markdown' }
      });
    }

    // Redirects — روابط قديمة
    const redirects = {
      '/blog/roas-vs-roi': '/blog/blog-2.html',
      '/blog/best-time-ads': '/blog/blog-3.html',
      '/blog/tiktok-ads-targeting': '/blog/blog-4.html',
      '/blog/ads-mistakes': '/blog/blog-5.html',
      '/blog/claude-ai-advertising': '/blog/blog-6.html',
      '/blog/meta-pixel-guide': '/blog/blog-12.html',
      '/blog/awareness-vs-conversions': '/blog/blog-14.html',
    };

    if (redirects[path]) {
      return Response.redirect(url.origin + redirects[path], 301);
    }

    // Routes بدون .html
    const htmlRoutes = [
      '/services', '/plan', '/cv', '/about', '/privacy'
    ];

    if (htmlRoutes.includes(path)) {
      const newUrl = new URL(request.url);
      newUrl.pathname = path + '.html';
      return env.ASSETS.fetch(new Request(newUrl, request));
    }

    // Blog routes بدون .html
    if (path.match(/^\/blog\/blog-\d+$/)) {
      const newUrl = new URL(request.url);
      newUrl.pathname = path + '.html';
      return env.ASSETS.fetch(new Request(newUrl, request));
    }

    return env.ASSETS.fetch(request);
  }
};
