(function() {
  // ═══ STYLES ═══
  const style = document.createElement('style');
  style.textContent = `
    #mo-chat-btn {
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9998;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #7C3AED, #06B6D4);
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(124,58,237,0.5);
      transition: transform 0.3s;
    }
    #mo-chat-btn:hover { transform: scale(1.1); }
    #mo-chat-btn .notif {
      position: absolute; top: -4px; right: -4px;
      width: 18px; height: 18px; background: #EF4444;
      border-radius: 50%; font-size: 11px; color: white;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800;
    }
    #mo-chat-box {
      position: fixed; bottom: 5.5rem; right: 1.5rem; z-index: 9999;
      width: 360px; max-height: 520px;
      background: #0F172A; border: 1px solid rgba(124,58,237,0.3);
      border-radius: 16px; display: flex; flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      font-family: 'Cairo', sans-serif; direction: rtl;
      overflow: hidden; opacity: 0; pointer-events: none;
      transform: translateY(10px);
      transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    #mo-chat-box.open { opacity: 1; pointer-events: all; transform: translateY(0); }
    .chat-header {
      background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1));
      border-bottom: 1px solid rgba(124,58,237,0.2);
      padding: 1rem; display: flex; align-items: center; gap: 0.7rem;
    }
    .chat-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, #7C3AED, #06B6D4);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem; flex-shrink: 0;
    }
    .chat-header-info { flex: 1; }
    .chat-header-name { font-size: 0.88rem; font-weight: 800; color: #F8FAFC; }
    .chat-header-status { font-size: 0.72rem; color: #10B981; display: flex; align-items: center; gap: 0.3rem; }
    .chat-header-status::before { content: ''; width: 6px; height: 6px; background: #10B981; border-radius: 50%; display: inline-block; }
    .chat-close { background: none; border: none; color: #64748B; cursor: pointer; font-size: 1.2rem; line-height: 1; }
    .chat-messages {
      flex: 1; overflow-y: auto; padding: 1rem; display: flex;
      flex-direction: column; gap: 0.7rem; min-height: 0;
      scrollbar-width: thin; scrollbar-color: rgba(124,58,237,0.3) transparent;
    }
    .msg { max-width: 85%; display: flex; flex-direction: column; gap: 0.2rem; }
    .msg.bot { align-self: flex-start; }
    .msg.user { align-self: flex-end; }
    .msg-bubble {
      padding: 0.6rem 0.9rem; border-radius: 12px;
      font-size: 0.83rem; line-height: 1.6; word-break: break-word;
    }
    .msg.bot .msg-bubble {
      background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.2);
      color: #E2E8F0; border-radius: 4px 12px 12px 12px;
    }
    .msg.user .msg-bubble {
      background: linear-gradient(135deg, #7C3AED, #06B6D4);
      color: white; border-radius: 12px 4px 12px 12px;
    }
    .typing { display: flex; gap: 4px; align-items: center; padding: 0.6rem 0.9rem; }
    .typing span {
      width: 7px; height: 7px; background: #A78BFA; border-radius: 50%;
      animation: typing 1.2s infinite;
    }
    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
    .quick-replies {
      display: flex; flex-wrap: wrap; gap: 0.4rem;
      padding: 0 1rem 0.5rem;
    }
    .qr-btn {
      background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.3);
      color: #A78BFA; padding: 0.35rem 0.75rem; border-radius: 20px;
      font-family: 'Cairo', sans-serif; font-size: 0.75rem; font-weight: 700;
      cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .qr-btn:hover { background: rgba(124,58,237,0.2); }
    .chat-input-area {
      border-top: 1px solid rgba(124,58,237,0.15);
      padding: 0.75rem; display: flex; gap: 0.5rem; align-items: flex-end;
    }
    .chat-input {
      flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(124,58,237,0.2);
      border-radius: 10px; padding: 0.55rem 0.8rem; color: #F8FAFC;
      font-family: 'Cairo', sans-serif; font-size: 0.83rem; outline: none;
      resize: none; max-height: 80px; line-height: 1.5; direction: rtl;
    }
    .chat-input:focus { border-color: rgba(124,58,237,0.5); }
    .chat-input::placeholder { color: #475569; }
    .chat-send {
      width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
      background: linear-gradient(135deg, #7C3AED, #06B6D4);
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: opacity 0.2s;
    }
    .chat-send:hover { opacity: 0.85; }
    .wa-suggest {
      margin: 0 1rem 0.7rem;
      background: linear-gradient(135deg, rgba(37,211,102,0.12), rgba(18,140,126,0.08));
      border: 1px solid rgba(37,211,102,0.25); border-radius: 10px;
      padding: 0.7rem; text-align: center;
    }
    .wa-suggest p { font-size: 0.78rem; color: #94A3B8; margin-bottom: 0.5rem; }
    .wa-suggest a {
      background: linear-gradient(135deg, #25D366, #128C7E); color: white;
      padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem;
      font-weight: 700; text-decoration: none; display: inline-block;
    }
    @media(max-width: 400px) {
      #mo-chat-box { width: calc(100vw - 2rem); right: 1rem; }
    }
  `;
  document.head.appendChild(style);

  // ═══ HTML ═══
  document.body.insertAdjacentHTML('beforeend', `
    <button id="mo-chat-btn" onclick="moChatToggle()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
      <div class="notif">1</div>
    </button>

    <div id="mo-chat-box">
      <div class="chat-header">
        <div class="chat-avatar">🤖</div>
        <div class="chat-header-info">
          <div class="chat-header-name">مساعد MO EHAB</div>
          <div class="chat-header-status">متاح الآن</div>
        </div>
        <button class="chat-close" onclick="moChatToggle()">✕</button>
      </div>
      <div class="chat-messages" id="mo-chat-msgs"></div>
      <div class="quick-replies" id="mo-qr"></div>
      <div id="mo-wa-suggest" style="display:none" class="wa-suggest">
        <p>تحدث مباشرة مع محمد إيهاب 👇</p>
        <a href="https://wa.me/966580395350" target="_blank">💬 واتساب الآن</a>
      </div>
      <div class="chat-input-area">
        <button class="chat-send" onclick="moSendMsg()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
        <textarea class="chat-input" id="mo-chat-input" placeholder="اكتب سؤالك هنا..." rows="1"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();moSendMsg()}"
          oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"></textarea>
      </div>
    </div>
  `);

  // ═══ STATE ═══
  let isOpen = false;
  let msgCount = 0;
  let showedWA = false;
  const history = [];

  const SYSTEM = `أنت مساعد ذكاء اصطناعي لـ MO EHAB ADS — وكالة إعلانات رقمية متخصصة.

معلوماتك الكاملة:

الخدمات والأسعار:
- إدارة حملات Meta/Google/TikTok/Snapchat: من 600 ريال/شهر
- الباقة الشاملة (كل المنصات): 2,000 ريال/شهر
- استشارة ساعة: 120 ريال
- استشارة شهرية (4 جلسات): 400 ريال/شهر
- إعداد Zid أو Salla: 240 ريال
- إعداد Shopify: 400 ريال
- رفع المنتجات (50 منتج): 320 ريال
- إدارة أمازون ونون: 500 ريال/شهر
- صفحة هبوط: 300 ريال
- SEO أساسي: 240 ريال
- SEO شهري: 320 ريال/شهر
- تصوير منتجات: حسب الطلب (السعودية فقط)
- فيديو إعلاني: حسب الطلب (السعودية فقط)
- مونتاج: حسب الطلب (السعودية فقط)
- إدارة مؤثرين: حسب الطلب (السعودية فقط)
- خطة تسويقية AI: 20 ريال
- سيرة ذاتية AI: 10 ريال

النتائج المحققة:
- ROAS 12.56x على Meta Ads
- ROAS 8.71x على TikTok
- 519,000 ريال مبيعات في 6 أشهر
- 6,200 متبرع لجمعية خيرية بتكلفة 13 ريال/متبرع
- +340% حجوزات مطعم في 60 يوم

الأسواق: السعودية، مصر، الإمارات، الكويت، قطر، البحرين

التواصل:
- واتساب السعودية: +966580395350
- واتساب مصر: +201090200880
- إيميل: mr.mohammedihab@gmail.com

قواعد الرد:
- رد بالعربية دائماً
- ردود قصيرة ومباشرة (2-4 أسطر)
- استخدم إيموجي بشكل معقول
- لو العميل مهتم بخدمة — اذكر السعر مباشرة
- لو سأل عن تواصل — أعطه رقم واتساب
- لا تكتب قوائم طويلة — كن مختصراً`;

  // ═══ FUNCTIONS ═══
  window.moChatToggle = function() {
    isOpen = !isOpen;
    document.getElementById('mo-chat-box').classList.toggle('open', isOpen);
    document.querySelector('#mo-chat-btn .notif').style.display = 'none';
    if (isOpen && msgCount === 0) moAddWelcome();
  };

  function moAddWelcome() {
    moAddMsg('bot', 'أهلاً! 👋 أنا مساعد MO EHAB ADS — يسعدني أساعدك في أي استفسار عن الخدمات والأسعار.');
    setTimeout(() => { moShowMainMenu(); }, 500);
  }

  function moAddMsg(role, text) {
    msgCount++;
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerHTML = `<div class="msg-bubble">${text.replace(/\n/g,'<br>')}</div>`;
    document.getElementById('mo-chat-msgs').appendChild(div);
    document.getElementById('mo-chat-msgs').scrollTop = 999999;

    if (role === 'user' && msgCount >= 6 && !showedWA) {
      showedWA = true;
      document.getElementById('mo-wa-suggest').style.display = 'block';
    }
  }

  function moSetQR(items) {
    const qr = document.getElementById('mo-qr');
    qr.innerHTML = '';
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'qr-btn';
      btn.textContent = item.text;
      btn.onclick = () => {
        qr.innerHTML = '';
        if (item.isBack) {
          moShowMainMenu();
        } else if (item.isWA) {
          window.open('https://wa.me/966580395350?text=' + encodeURIComponent(item.waMsg), '_blank');
          moShowMainMenu();
        } else {
          moHandleMsg(item.msg);
        }
      };
      qr.appendChild(btn);
    });
  }

  function moShowMainMenu() {
    moSetQR([
      { text: '💰 الأسعار', msg: 'كم تكلفة الخدمات؟' },
      { text: '📢 الإعلانات', msg: 'ما هي خدمات الإعلانات؟' },
      { text: '📸 التصوير', msg: 'ما هي خدمة التصوير؟' },
      { text: '🌟 المؤثرين', msg: 'ما هي خدمة المؤثرين؟' },
      { text: '📊 النتائج', msg: 'ما هي أبرز النتائج التي حققتموها؟' },
      { text: '💬 تواصل', msg: 'كيف أتواصل معكم؟' },
    ]);
  }

  function moShowTyping() {
    const div = document.createElement('div');
    div.className = 'msg bot'; div.id = 'mo-typing';
    div.innerHTML = '<div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>';
    document.getElementById('mo-chat-msgs').appendChild(div);
    document.getElementById('mo-chat-msgs').scrollTop = 999999;
  }

  function moHideTyping() {
    const t = document.getElementById('mo-typing');
    if (t) t.remove();
  }

  async function moHandleMsg(text) {
    moAddMsg('user', text);
    document.getElementById('mo-qr').innerHTML = '';
    moShowTyping();

    history.push({ role: 'user', content: text });
    if (history.length > 10) history.splice(0, 2);

    try {
      const res = await fetch('https://claude-proxy.mr-mohammedihab.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          system: SYSTEM,
          messages: history
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'عذراً، حدث خطأ. تواصل معنا على واتساب مباشرة.';
      moHideTyping();
      moAddMsg('bot', reply);
      history.push({ role: 'assistant', content: reply });

      // Show WA button if mentions contact
      if (text.includes('تواصل') || text.includes('واتساب') || text.includes('اتصال') || reply.includes('واتساب')) {
        document.getElementById('mo-wa-suggest').style.display = 'block';
      }

      // Detect service interest and show order button
      const serviceMap = [
        { keys: ['مبيعات','بيعات'], name: 'حملة مبيعات', price: '1,400 ريال/شهر' },
        { keys: ['رسايل','رسائل','messages'], name: 'حملة رسايل', price: '1,000 ريال/شهر' },
        { keys: ['متابعين','followers'], name: 'حملة متابعين', price: '600 ريال/شهر' },
        { keys: ['شاملة','شامل','كل المنصات'], name: 'الباقة الشاملة', price: '2,000 ريال/شهر' },
        { keys: ['استشارة','استشاره'], name: 'استشارة تسويقية', price: '120 ريال' },
        { keys: ['صفحة هبوط','landing'], name: 'صفحة هبوط', price: '300 ريال' },
        { keys: ['seo','سيو'], name: 'تهيئة SEO', price: '240 ريال' },
        { keys: ['زيد','سلة','zid','salla'], name: 'إعداد متجر', price: '240 ريال' },
        { keys: ['شوبيفاي','shopify'], name: 'إعداد Shopify', price: '400 ريال' },
        { keys: ['تصوير','تصويرة'], name: 'تصوير منتجات', price: 'حسب الطلب' },
        { keys: ['فيديو','video'], name: 'فيديو إعلاني', price: 'حسب الطلب' },
        { keys: ['مونتاج','montage'], name: 'مونتاج', price: 'حسب الطلب' },
        { keys: ['مؤثر','مشهور','influencer'], name: 'إدارة مؤثرين', price: 'حسب الطلب' },
        { keys: ['خطة','plan'], name: 'خطة تسويقية AI', price: '20 ريال' },
      ];

      let detected = null;
      const combined = text + ' ' + reply;
      for (const svc of serviceMap) {
        if (svc.keys.some(k => combined.includes(k))) {
          detected = svc; break;
        }
      }

      const btns = [
        { text: '🏠 القائمة الرئيسية', msg: null, isBack: true },
      ];

      if (detected) {
        const waMsg = `مرحباً، أنا مهتم بـ ${detected.name} — ${detected.price}. تحدثت مع المساعد الذكي وأريد إتمام الطلب.`;
        btns.unshift({ text: `✅ اطلب ${detected.name}`, msg: null, isWA: true, waMsg });
      } else {
        btns.push({ text: '💬 تواصل على واتساب', msg: 'كيف أتواصل معكم؟' });
      }

      moSetQR(btns);
    } catch(e) {
      moHideTyping();
      moAddMsg('bot', 'عذراً، حدث خطأ مؤقت. تواصل معنا مباشرة على واتساب 👇');
      document.getElementById('mo-wa-suggest').style.display = 'block';
    }
  }

  window.moSendMsg = function() {
    const input = document.getElementById('mo-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';
    moHandleMsg(text);
  };

})();
