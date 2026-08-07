export default {
  async fetch(request, env) {
    const accept = request.headers.get('Accept') || '';
    const url = new URL(request.url);

    // If agent requests markdown
    if (accept.includes('text/markdown') && url.pathname === '/') {
      const markdown = `# MO EHAB ADS — Mohamed Ehab

## Paid Advertising Specialist | Saudi Arabia & Egypt

10+ years experience in Meta, Google, TikTok, Snapchat Ads.

## Services
- Meta Ads Management — from 600 SAR/month
- Google Ads Management — from 600 SAR/month
- TikTok & Snapchat Ads
- Pixel & Tracking Setup — from 200 SAR
- Landing Pages — from 300 SAR
- AI Marketing Plan — 20 SAR

## Results
- Fashion store: ROAS 0.7x → 8.4x in 90 days
- Restaurant: +340% bookings in 60 days
- Nonprofit: 6,200 donors at 13 SAR each
- App: 12,000 downloads at 4.2 SAR each

## Contact
- Website: https://moehabads.com
- WhatsApp: +966580395350
- Email: mr.mohammedihab@gmail.com

## Links
- Services: https://moehabads.com/services
- Blog: https://moehabads.com/blog
- AI Plan: https://moehabads.com/plan
`;

      return new Response(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Default — serve normal page
    return fetch(request);
  }
};
