exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { projectName, industry, audience, budget, goal, country } = JSON.parse(event.body);
    const apiKey = process.env.ANTHROPIC_API_KEY;

    const prompt = `أنت خبير تسويق رقمي متخصص في السوق العربي والخليجي.

قم بإنشاء خطة تسويقية رقمية شاملة ومفصلة للمشروع التالي:

اسم المشروع: ${projectName}
نوع النشاط: ${industry}
الجمهور المستهدف: ${audience}
الميزانية الإعلانية الشهرية: ${budget}
الهدف الرئيسي: ${goal}
الدولة: ${country || 'السعودية'}

اكتب الخطة بالعربية بشكل منظم يشمل:

## 1. تحليل المشروع
تحليل سريع للوضع الحالي والفرص المتاحة

## 2. المنصات الموصى بها
أفضل 2-3 منصات إعلانية مع سبب اختيار كل منصة

## 3. استراتيجية الاستهداف
الجمهور المستهدف بالتفصيل (العمر، الاهتمامات، السلوك)

## 4. توزيع الميزانية
كيفية توزيع الميزانية على المنصات المختلفة

## 5. أهداف الأداء المتوقعة (KPIs)
أرقام واقعية متوقعة في الشهر الأول

## 6. خطة المحتوى
3-5 أفكار إعلانية مناسبة للمشروع

## 7. الخطوات التنفيذية
خطوات عملية للبدء فوراً

اجعل الخطة عملية ومباشرة وقابلة للتنفيذ.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const plan = data.content[0].text;

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
