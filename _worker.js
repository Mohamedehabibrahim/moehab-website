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

    return env.ASSETS.fetch(request);
  }
};
