const SLUGS = {
"/blog/تخفيض-تكلفة-اعلانات-meta": "/blog/blog-1",
"/blog/roas-vs-roi": "/blog/blog-2",
"/blog/best-time-ads": "/blog/blog-3",
"/blog/tiktok-ads-targeting": "/blog/blog-4",
"/blog/ads-mistakes": "/blog/blog-5",
"/blog/claude-ai-advertising": "/blog/blog-6",
"/blog/ai-digital-marketing": "/blog/blog-7",
"/blog/chatgpt-vs-claude-marketing": "/blog/blog-8",
"/blog/snapchat-ads-guide": "/blog/blog-9",
"/blog/google-ads-vs-meta-ads": "/blog/blog-10",
"/blog/ai-ad-copywriting": "/blog/blog-11",
"/blog/meta-pixel-guide": "/blog/blog-12",
"/blog/advertising-funnel": "/blog/blog-13",
"/blog/awareness-vs-conversions": "/blog/blog-14",
"/blog/professional-ad-report": "/blog/blog-15",
"/blog/build-brand-social-media": "/blog/blog-16",
"/blog/ramadan-ads-guide": "/blog/blog-17",
"/blog/choose-advertising-agency": "/blog/blog-18",
"/blog/retargeting-guide": "/blog/blog-19",
"/blog/measure-campaign-success": "/blog/blog-20",
"/blog/case-study-fashion-store": "/blog/blog-21",
"/blog/case-study-restaurant": "/blog/blog-22",
"/blog/case-study-charity": "/blog/blog-23",
"/blog/case-study-mobile-app": "/blog/blog-24",
"/blog/case-study-b2b": "/blog/blog-25",
"/blog/aida-copywriting-ads": "/blog/blog-26",
"/blog/tiktok-ads-guide-2026": "/blog/blog-27",
"/blog/ab-testing-meta-ads": "/blog/blog-28",
"/blog/awareness-vs-conversions-vs-traffic": "/blog/blog-29",
"/blog/google-shopping-ads-guide": "/blog/blog-30",
"/blog/scroll-stopping-caption": "/blog/blog-31",
"/blog/whatsapp-marketing-guide": "/blog/blog-32",
"/blog/ugc-ads-guide": "/blog/blog-33",
"/blog/email-marketing-arabic-stores": "/blog/blog-34",
"/blog/marketing-plan-new-business": "/blog/blog-35",
"/blog/organic-vs-paid-marketing": "/blog/blog-36",
"/blog/customer-avatar-guide": "/blog/blog-37",
"/blog/social-proof-7-ways": "/blog/blog-38",
"/blog/calculate-advertising-budget": "/blog/blog-39",
"/blog/influencer-marketing-guide": "/blog/blog-40",
"/blog/landing-page-vs-website": "/blog/blog-41",
"/blog/manage-multiple-clients-ads": "/blog/blog-42",
"/blog/video-marketing-2026": "/blog/blog-43",
"/blog/google-ads-quality-score": "/blog/blog-44",
"/blog/competitor-analysis-guide": "/blog/blog-45",
"/blog/ai-website-readiness": "/blog/blog-46",
"/blog/meta-advantage-plus-guide": "/blog/blog-47",
"/blog/google-pmax-guide": "/blog/blog-48",
"/blog/first-party-data-marketing": "/blog/blog-49",
"/blog/social-commerce-guide": "/blog/blog-50",
"/blog/privacy-first-marketing": "/blog/blog-51",
"/blog/voice-search-optimization": "/blog/blog-52",
"/blog/zero-click-marketing": "/blog/blog-53",
"/blog/hyper-personalization-ads": "/blog/blog-54",
"/blog/ai-chatbots-sales": "/blog/blog-55",
"/blog/programmatic-advertising": "/blog/blog-56",
"/blog/micro-moments-marketing": "/blog/blog-57",
"/blog/ar-ads-snapchat-meta": "/blog/blog-58",
"/blog/connected-tv-ads": "/blog/blog-59",
"/blog/cookieless-tracking-guide": "/blog/blog-60",
"/blog/ai-content-creation-marketing": "/blog/blog-61",
"/blog/google-core-update-2026-arabic-sites": "/blog/blog-62",
"/blog/ai-search-seo-chatgpt-perplexity-2026": "/blog/blog-63",
"/blog/seo-changes-2026-must-apply": "/blog/blog-64",
"/blog/meta-ads-advantage-plus-ai-2026": "/blog/blog-65",
"/blog/google-performance-max-2026": "/blog/blog-66",
"/blog/ai-changing-digital-advertising-2026": "/blog/blog-67"
};

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
Email: info@moehabads.com
`;
      return new Response(markdown, {
        headers: { 'Content-Type': 'text/markdown' }
      });
    }

    // old article slugs → real article URLs (permanent)
    let p = path; try { p = decodeURIComponent(path); } catch (e) {}
    p = p.replace(/\/+$/, '');
    if (SLUGS[p]) return Response.redirect(url.origin + SLUGS[p], 301);

    return env.ASSETS.fetch(request);
  }
};
