import React, { useState, useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════
   GLOBAL STYLES — PURE EDITORIAL
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Instrument+Serif:ital@0;1&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
:root{
  --black: #080808;
  --white: #f4f2ee;
  --off: #e8e4dc;
  --dim: #888888;
  --dimmer: #444444;
  --border: rgba(244,242,238,0.12);
  --border-mid: rgba(244,242,238,0.3);
}
body{background:var(--black);color:var(--white);font-family:'DM Mono',monospace;overflow-x:hidden;cursor:none;-webkit-font-smoothing:antialiased}
#root{max-width:100%!important;width:100%!important;margin:0!important;padding:0!important;text-align:left!important;display:block!important;border:none!important}
::selection{background:var(--white);color:var(--black)}

/* LOADER */
.loader-wrap{position:fixed;inset:0;background:var(--black);z-index:9999999;display:flex;align-items:center;justify-content:center;transition:transform 1s cubic-bezier(0.7,0,0.3,1)}
.loader-wrap.done{transform:translateY(-100%)}
.loader-text{display:flex;align-items:baseline;opacity:0;animation:fade-in-up 0.8s ease forwards 0.3s}
.loader-name{font-family:'Playfair Display',serif;font-style:italic;font-size:clamp(2.5rem,6vw,4.5rem);color:var(--white);letter-spacing:0.02em}
.loader-ext{font-family:'DM Mono',monospace;font-size:clamp(1rem,2.5vw,1.5rem);color:var(--dim);margin-left:0.2rem}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

/* CURSOR */
.c-dot,.c-ring{position:fixed;border-radius:50%;pointer-events:none;z-index:99999;top:0;left:0;transform:translate3d(-300px,-300px,0)}
.c-dot{width:5px;height:5px;margin:-2.5px 0 0 -2.5px;background:var(--white)}
.c-ring{width:28px;height:28px;margin:-14px 0 0 -14px;border:1px solid rgba(244,242,238,.4);transition:transform .1s ease-out,width .25s,height .25s,margin .25s,background .25s,border-color .25s}
body.hov .c-ring{width:48px;height:48px;margin:-24px 0 0 -24px;background:rgba(244,242,238,.05);border-color:rgba(244,242,238,.8)}
@media(pointer:coarse){.c-dot,.c-ring{display:none}body{cursor:auto}}

/* GLOBAL BACKGROUND EFFECTS (Grid) */
.grid-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(244,242,238,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(244,242,238,0.018) 1px,transparent 1px);background-size:60px 60px;}

/* SPIN ANIMATIONS FOR HERO RINGS */
@keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes spin-rev{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}

/* ── ATTACHED, FULL-WIDTH, GLASSY NAV ── */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 200;
  padding: 1.5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(8, 8, 8, 0.4);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(244, 242, 238, 0.08);
  transition: all 0.4s ease;
}
.nav.s {
  background: rgba(8, 8, 8, 0.85);
  padding: 1rem 3rem;
  border-bottom: 1px solid rgba(244, 242, 238, 0.15);
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
}
.nav-logo{font-family:'Playfair Display',serif;font-style:italic;font-size:1.1rem;color:var(--white);letter-spacing:.02em;cursor:none;white-space:nowrap}
.nav-links{display:flex;gap:2.2rem;align-items:center}
.nav-link{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);background:none;border:none;cursor:none;transition:color .3s;font-family:'DM Mono',monospace;padding:0;position:relative}
.nav-link::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:var(--white);transition:width .3s}
.nav-link:hover,.nav-link.act{color:var(--white)}
.nav-link:hover::after,.nav-link.act::after{width:100%;background:var(--white)}
.nav-cta{font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;color:var(--black);background:var(--white);border:none;cursor:none;padding:.5rem 1.2rem;font-family:'DM Mono',monospace;transition:opacity .3s, transform .3s;border-radius:2px;white-space:nowrap}
.nav-cta:hover{opacity:.9;transform:scale(1.05)}
.hamburger{display:none;flex-direction:column;gap:5px;cursor:none;background:none;border:none;padding:4px}
.hamburger span{display:block;width:22px;height:1px;background:var(--white);transition:all .3s ease}
.hamburger.open span:nth-child(1){transform:translateY(6px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.hamburger.open span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}

@media(max-width:860px){
  .nav{padding: 1.2rem 1.5rem;}
  .nav.s{padding: 1rem 1.5rem;}
  .nav-links{display:none}
  .hamburger{display:flex}
}

/* ── MOB MENU ── */
.mob-menu {
  position: fixed;
  inset: 0;
  z-index: 190;
  background: var(--black);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  transform: translateX(100%);
  opacity: 0;
  pointer-events: none;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.mob-menu.open {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
}
.mob-link{font-size:1.8rem;font-family:'Playfair Display',serif;font-style:italic;color:var(--white);background:none;border:none;cursor:none;letter-spacing:.02em;transition:opacity .3s, transform .3s}
.mob-link:hover{opacity:.6;transform:translateX(8px)}

/* SECTIONS */
.sec{width:100%;padding:8rem 3rem;border-top:1px solid var(--border);position:relative;z-index:1;overflow:hidden;}
.sec-inner{max-width:72rem;margin:0 auto;position:relative;z-index:2;}
@media(max-width:860px){.sec{padding:5rem 1.5rem}}

/* LABEL */
.lbl{font-size:.56rem;letter-spacing:.25em;text-transform:uppercase;color:var(--dim);margin-bottom:1.2rem;display:flex;align-items:center;gap:.8rem}
.lbl::before{content:'';width:1.5rem;height:1px;background:var(--dimmer);display:block}

/* HEADINGS */
.display{font-family:'Playfair Display',serif;font-weight:900;color:var(--white);line-height:.95;letter-spacing:-.02em}
.serif-it{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400}

/* CARD */
.card{border:1px solid var(--border);background:rgba(244,242,238,.015);padding:2.5rem;transition:border-color .4s,background .4s;position:relative;overflow:hidden;border-radius:4px}
.card:hover{border-color:var(--border-mid);background:rgba(244,242,238,.03)}

/* SKILL BAR */
.sb-track{width:100%;height:1px;background:rgba(244,242,238,.15);margin-top:.6rem}
.sb-fill{height:100%;background:var(--white);transition:width 1.5s cubic-bezier(.16,1,.3,1)}

/* TAG */
.tag{display:inline-block;font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;border:1px solid var(--border);color:var(--dim);padding:.3rem .8rem;font-family:'DM Mono',monospace;border-radius:20px;background:rgba(244,242,238,.02);transition:color .3s, border-color .3s}
.tag:hover{color:var(--white);border-color:var(--white)}

/* BUTTON */
.btn{display:inline-flex;align-items:center;gap:.8rem;border:1px solid var(--white);color:var(--white);font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;padding:.9rem 2.2rem;cursor:none;position:relative;overflow:hidden;transition:color .4s;text-decoration:none;background:none;border-radius:30px}
.btn::before{content:'';position:absolute;inset:0;background:var(--white);transform:translateX(-101%);transition:transform .5s cubic-bezier(.16,1,.3,1)}
.btn:hover{color:var(--black)}
.btn:hover::before{transform:translateX(0)}
.btn>*{position:relative;z-index:1}

/* ICON BUTTON */
.ibtn{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);color:var(--dim);cursor:none;background:none;transition:border-color .3s,color .3s;text-decoration:none;border-radius:50%}
.ibtn:hover{border-color:var(--white);color:var(--white)}

/* BLINK */
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.blink{animation:blink 1.2s step-end infinite}

/* REVEAL */
.rv{opacity:0;transform:translateY(30px);transition:opacity 0.9s cubic-bezier(.16,1,.3,1),transform 0.9s cubic-bezier(.16,1,.3,1)}
.rv.vis{opacity:1;transform:none}

/* MARQUEE */
.mq-wrap{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:1rem 0;position:relative;z-index:2;background:rgba(244,242,238,.01)}
.mq-track{display:flex;gap:4rem;white-space:nowrap;animation:mq 25s linear infinite}
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mq-item{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:var(--dimmer);display:flex;align-items:center;gap:.8rem;flex-shrink:0;font-family:'DM Mono',monospace}
.mq-dot{width:3px;height:3px;background:var(--dimmer);transform:rotate(45deg)}

/* GALLERY FLEX EXPAND */
.gal-item{flex:1;border-radius:8px;overflow:hidden;position:relative;cursor:none;border:1px solid var(--border);transition:flex 0.8s cubic-bezier(0.16,1,0.3,1),border-color 0.5s; background:var(--black)}
.gal-item:hover{border-color:var(--white)}

/* LIGHTBOX */
.lb{position:fixed;inset:0;z-index:99980;background:rgba(8,8,8,.98);display:flex;align-items:center;justify-content:center;animation:fbIn .3s ease;backdrop-filter:blur(10px)}
@keyframes fbIn{from{opacity:0}to{opacity:1}}

/* CHATBOT */
.chat-fab{position:fixed;bottom:2rem;right:2rem;z-index:9000;width:52px;height:52px;background:var(--white);border:none;cursor:none;display:flex;align-items:center;justify-content:center;color:var(--black);border-radius:50%;transition:opacity .3s,transform .3s;box-shadow:0 10px 30px rgba(0,0,0,0.5)}
.chat-fab:hover{opacity:.9;transform:scale(1.05)}
.chat-panel{position:fixed;bottom:6rem;right:2rem;z-index:9000;width:360px;background:var(--black);border:1px solid var(--border-mid);display:flex;flex-direction:column;transition:opacity .4s cubic-bezier(.16,1,.3,1),transform .4s cubic-bezier(.16,1,.3,1);max-height:500px;border-radius:8px;box-shadow:0 20px 40px rgba(0,0,0,0.8)}
.chat-panel.hidden{opacity:0;transform:translateY(20px);pointer-events:none}
.chat-header{padding:1rem 1.2rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:rgba(244,242,238,.02)}
.chat-msgs{flex:1;overflow-y:auto;padding:1.2rem;display:flex;flex-direction:column;gap:.8rem;min-height:200px}
.chat-msgs::-webkit-scrollbar{width:2px}
.chat-msgs::-webkit-scrollbar-thumb{background:var(--dimmer)}
.msg{max-width:85%;font-size:.65rem;line-height:1.7;padding:.7rem .9rem;font-family:'DM Mono',monospace;border-radius:4px}
.msg.bot{align-self:flex-start;background:rgba(244,242,238,.05);border:1px solid var(--border);color:var(--off)}
.msg.user{align-self:flex-end;background:var(--white);color:var(--black)}
.msg.typing{align-self:flex-start;background:rgba(244,242,238,.03);border:1px solid var(--border);padding:.6rem 1rem}
.tdot{width:4px;height:4px;border-radius:50%;background:var(--dim);animation:tdot 1.2s ease-in-out infinite}
.tdot:nth-child(2){animation-delay:.2s}
.tdot:nth-child(3){animation-delay:.4s}
@keyframes tdot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
.chat-chips{padding:.6rem .9rem .4rem;display:flex;flex-wrap:wrap;gap:.4rem;border-top:1px solid var(--border);flex-shrink:0;background:var(--black)}
.chip{font-size:.52rem;letter-spacing:.15em;text-transform:uppercase;border:1px solid var(--border);background:none;color:var(--dim);padding:.3rem .6rem;cursor:none;font-family:'DM Mono',monospace;transition:border-color .3s,color .3s;border-radius:20px}
.chip:hover{border-color:var(--white);color:var(--white)}
.chat-input-row{padding:.8rem .9rem;border-top:1px solid var(--border);display:flex;gap:.5rem;flex-shrink:0;background:var(--black)}
.chat-input{flex:1;background:none;border:1px solid var(--border);color:var(--white);font-family:'DM Mono',monospace;font-size:.65rem;padding:.5rem .8rem;outline:none;transition:border-color .3s;cursor:text;border-radius:4px}
.chat-input:focus{border-color:var(--dim)}
.chat-input::placeholder{color:var(--dimmer)}
.chat-send{background:var(--white);border:none;color:var(--black);width:34px;height:34px;cursor:none;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .3s;border-radius:4px}
.chat-send:hover{opacity:.8}
@media(max-width:500px){.chat-panel{width:calc(100vw - 2rem);right:1rem;bottom:5.5rem}.chat-fab{right:1rem;bottom:1.5rem}}

/* FOOTER */
.footer{width:100%;padding:2rem 3rem;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2;background:var(--black)}
@media(max-width:640px){.footer{padding:1.5rem;flex-direction:column;gap:.8rem;text-align:center}}
`;

/* ═══════════════════════════════════════════════
   TYPEWRITER HOOK
═══════════════════════════════════════════════ */
function useTypewriter(words, speed = 85, pause = 2200) {
  const [txt, setTxt] = useState('');
  const state = useRef({ wi: 0, ci: 0, del: false });
  useEffect(() => {
    let timer;
    const tick = () => {
      const { wi, ci, del } = state.current;
      const word = words[wi];
      if (!del && ci < word.length) {
        state.current.ci++;
        setTxt(word.slice(0, state.current.ci));
        timer = setTimeout(tick, speed);
      } else if (!del) {
        state.current.del = true;
        timer = setTimeout(tick, pause);
      } else if (del && ci > 0) {
        state.current.ci--;
        setTxt(word.slice(0, state.current.ci));
        timer = setTimeout(tick, speed / 2.2);
      } else {
        state.current.del = false;
        state.current.wi = (wi + 1) % words.length;
        timer = setTimeout(tick, 320);
      }
    };
    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, [words, speed, pause]);
  return txt;
}

/* ═══════════════════════════════════════════════
   SKILL BAR
═══════════════════════════════════════════════ */
function SkillBar({ name, pct, delay = 0 }) {
  const [w, setW] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setW(pct), delay); obs.disconnect(); }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref} style={{ marginBottom: '1.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem' }}>
        <span style={{ fontSize: '.65rem', letterSpacing: '.05em', color: 'var(--off)', fontFamily: "'DM Mono',monospace" }}>{name}</span>
        <span style={{ fontSize: '.6rem', color: 'var(--dim)', fontFamily: "'DM Mono',monospace" }}>{pct}%</span>
      </div>
      <div className="sb-track"><div className="sb-fill" style={{ width: `${w}%` }} /></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CHATBOT
═══════════════════════════════════════════════ */
const R = {
  greet: ["Hello. I'm the AI assistant for Sai Sankar. Ask me about his work, skills, or how to reach him.", "Hi there. I can detail Sai's projects, AI expertise, or professional experience. What would you like to know?"],
  about: ["Sai Sankar is a final-year AI Engineering student focused on LLMs, RAG, and enterprise AI. He operates at the intersection of cutting-edge GenAI and robust enterprise integration.", "He is obsessed with building intelligent systems — fine-tuning open-source models, designing RAG pipelines, and embedding AI securely into corporate infrastructure."],
  skills: ["Expertise includes: LLM fine-tuning, RAG architecture, prompt engineering, Python, SAP CPI, PEFT/LoRA, and local model deployment.", "He works extensively with CodeT5, Qwen 2.5, and DeepSeek. On the enterprise side, his stack includes SAP CPI, data pipelines, PGP encryption, and SFTP transfers."],
  project: ["His Magnum Opus is an AI-Powered Code Translation & Explanation Engine. It uses a fine-tuned CodeT5 model, Qwen/DeepSeek fallbacks, and a RAG layer to translate syntax and explain logic contextually.", "He built a multi-pipeline developer tool that combines fine-tuned models, zero-shot inference, and RAG architectures to dissect code."],
  experience: ["He worked as an SAP Technical Consultant at VKollab Technologies, architecting real-time enterprise integration scenarios and handling sensitive customer data synchronization.", "At VKollab, he engineered complex integration flows, utilizing SAP CPI, PGP encryption, and secure transfers to build robust pipelines."],
  contact: ["You can reach Sai on LinkedIn (sai-sankar-dokku-0586a1289), GitHub (Sai081), or Instagram (@saisankar.co).", "Use LinkedIn for professional inquiries and GitHub to view his code. He is open to collaborations and roles."],
  ai: ["His current focus encompasses agentic AI frameworks, multimodal LLMs, PEFT/LoRA fine-tuning, and production-grade RAG systems.", "He is actively researching autonomous multi-agent systems and aligning foundation models to highly specific, domain-restricted tasks."],
  fallback: ["I am not sure I understand. Try asking about Sai's skills, projects, experience, or contact info.", "I can best answer questions regarding his professional background, AI projects, or how to reach him.", "Could you rephrase? You can ask about his work or GenAI interests."]
};
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getReply(m) {
  const t = m.toLowerCase();
  if (/hi|hello|hey|sup|yo/.test(t)) return pick(R.greet);
  if (/about|who|background|story|mindset|introduce/.test(t)) return pick(R.about);
  if (/skill|tech|stack|python|sap|rag|know|language|framework/.test(t)) return pick(R.skills);
  if (/project|build|code|translat|explain|engine|codet5|qwen|deepseek/.test(t)) return pick(R.project);
  if (/experi|intern|job|vkollab|consult|career/.test(t)) return pick(R.experience);
  if (/contact|reach|linkedin|github|hire|talk/.test(t)) return pick(R.contact);
  if (/ai|llm|gpt|model|fine.?tun|agent|rag|multimodal|genai|ml/.test(t)) return pick(R.ai);
  return pick(R.fallback);
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: 'bot', text: "Hello. I am the AI assistant for Sai Sankar. Ask me anything about his work, skills, or projects." }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef();
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = (txt) => {
    const t = (txt || input).trim();
    if (!t) return;
    setMsgs(p => [...p, { role: 'user', text: t }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { role: 'bot', text: getReply(t) }]);
    }, 850 + Math.random() * 550);
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(o => !o)} data-hover title="AI Assistant">
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        }
      </button>

      <div className={`chat-panel ${open ? '' : 'hidden'}`}>
        <div className="chat-header">
          <div>
            <div style={{ fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--white)', fontFamily: "'DM Mono',monospace" }}>Sai's AI</div>
            <div style={{ fontSize: '.52rem', color: 'var(--dim)', letterSpacing: '.1em', marginTop: '.2rem', display: 'flex', alignItems: 'center', gap: '.35rem', fontFamily: "'DM Mono',monospace" }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--white)', display: 'inline-block' }} />Online
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'none', display: 'flex', alignItems: 'center', transition: 'color .25s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--dim)'}
            data-hover>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="chat-msgs">
          {msgs.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.text}</div>)}
          {typing && (
            <div className="msg typing">
              <div style={{ display: 'flex', gap: '.32rem', alignItems: 'center' }}>
                <div className="tdot" /><div className="tdot" /><div className="tdot" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="chat-chips">
          {['Projects', 'Skills', 'Experience', 'Contact', 'AI interests'].map(c => (
            <button key={c} className="chip" onClick={() => send(c)} data-hover>{c}</button>
          ))}
        </div>

        <div className="chat-input-row">
          <input className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask anything..." />
          <button className="chat-send" onClick={() => send()} data-hover>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════ */
const Github = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>;
const Linkedin = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>;
const Insta = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>;
const Arrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const Close = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

/* ═══════════════════════════════════════════════
   APP
═══════════════════════════════════════════════ */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');
  const [mobOpen, setMobOpen] = useState(false);
  const [hovGal, setHovGal] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const dotRef = useRef();
  const ringRef = useRef();

  const roles = ['LLM Engineer', 'RAG Architect', 'AI Systems Builder', 'Enterprise Integrator', 'Model Tinkerer'];
  const role = useTypewriter(roles, 82, 2100);

  // Initial Loading Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Inject CSS
  useEffect(() => {
    const el = document.createElement('style');
    el.innerHTML = CSS;
    document.head.appendChild(el);
    const root = document.getElementById('root');
    if (root) Object.assign(root.style, { maxWidth: '100%', width: '100%', margin: '0', padding: '0', textAlign: 'left', display: 'block', border: 'none' });
    Object.assign(document.body.style, { margin: '0', padding: '0', background: 'var(--black)', overflowX: 'hidden' });
    return () => { try { document.head.removeChild(el); } catch { } };
  }, []);

  // Auto-rotate hero images every 4 seconds
  const [heroImgIdx, setHeroImgIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImgIdx((prev) => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Cursor logic
  useEffect(() => {
    const move = ({ clientX: x, clientY: y }) => {
      dotRef.current?.style.setProperty('transform', `translate3d(${x}px,${y}px,0)`);
      ringRef.current?.style.setProperty('transform', `translate3d(${x}px,${y}px,0)`);
    };
    const over = (e) => {
      if (e.target.closest('button,a,[data-hover],input, .gal-item, .hero-img-wrap')) document.body.classList.add('hov');
      else document.body.classList.remove('hov');
    };
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); };
  }, []);

  // Scroll tracker
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      const ids = ['hero', 'about', 'skills', 'projects', 'experience', 'gallery', 'contact'];
      const y = window.scrollY + 180;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y && el.offsetTop + el.offsetHeight > y) { setActive(id); break; }
      }
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    if (loading) return; // wait for loader to finish
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
    }, { threshold: 0.08 });
    const t = setTimeout(() => { document.querySelectorAll('.rv').forEach(el => obs.observe(el)); }, 120);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, [loading]);

  // Modals Scroll Lock
  useEffect(() => {
    if (mobOpen || lightbox || loading) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobOpen, lightbox, loading]);

  const scrollTo = (id) => {
    setMobOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }, mobOpen ? 350 : 0);
  };

  const navItems = ['About', 'Skills', 'Projects', 'Experience', 'Gallery'];
  const galImgs = ['/1000006197.jpg', '/1000013842.webp', '/1000016880.jpg'];
  const heroImgs = ['/1000016880.jpg', '/1000013842.webp'];
  const mqItems = ['LLM Fine-Tuning', 'RAG Architecture', 'Multi-Agent Systems', 'SAP CPI', 'CodeT5', 'Qwen 2.5', 'DeepSeek', 'PEFT / LoRA', 'Vector Databases', 'Enterprise AI', 'Python', 'Transformers'];

  const skills = [
    { name: 'Prompt Engineering & LLM Design', pct: 92, delay: 0 },
    { name: 'LLM Fine-tuning & PEFT / LoRA', pct: 87, delay: 80 },
    { name: 'RAG Architecture & Vector DBs', pct: 85, delay: 160 },
    { name: 'Python & AI Frameworks', pct: 90, delay: 240 },
    { name: 'SAP CPI & Enterprise Integration', pct: 80, delay: 320 },
    { name: 'AI System Design', pct: 83, delay: 400 },
  ];

  const p = (s, extra = {}) => ({ fontSize: '.75rem', lineHeight: 1.9, color: 'var(--dim)', fontFamily: "'DM Mono',monospace", letterSpacing: '.02em', ...extra });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', position: 'relative', overflow: 'hidden' }}>

      {/* ── PREMIUM LOADING SCREEN ── */}
      <div className={`loader-wrap ${!loading ? 'done' : ''}`}>
        <div className="loader-text">
          <span className="loader-name">sai sankar</span>
          <span className="loader-ext">.co</span>
        </div>
      </div>

      {/* Cursors */}
      <div className="c-dot" ref={dotRef} />
      <div className="c-ring" ref={ringRef} />

      {/* Screen Effects (Grid everywhere) */}
      <div className="grid-bg" />

      {/* Mobile drawer */}
      <div className={`mob-menu ${mobOpen ? 'open' : ''}`}>
        {navItems.map(n => <button key={n} className="mob-link" onClick={() => scrollTo(n.toLowerCase())} data-hover>{n}</button>)}
        <button className="mob-link" onClick={() => scrollTo('contact')} data-hover style={{ fontSize: '1.4rem', opacity: .55, marginTop: '1rem' }}>Contact</button>
      </div>

      {/* NAV (Full width, top attached) */}
      <nav className={`nav ${scrolled ? 's' : ''}`}>
        <div className="nav-logo" onClick={() => scrollTo('hero')} data-hover>Sai Sankar.</div>
        <div className="nav-links">
          {navItems.map(n => (
            <button key={n} className={`nav-link ${active === n.toLowerCase() ? 'act' : ''}`} onClick={() => scrollTo(n.toLowerCase())} data-hover>{n}</button>
          ))}
          <button className="nav-cta" onClick={() => scrollTo('contact')} data-hover>Contact</button>
        </div>
        <button className={`hamburger ${mobOpen ? 'open' : ''}`} onClick={() => setMobOpen(o => !o)} data-hover>
          <span /><span /><span />
        </button>
      </nav>

      {/* ── HERO (0) — GRID BACKGROUND ── */}
      <section id="hero" className="sec" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', padding: '9rem 3rem 6rem', borderTop: 'none' }}>

        <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '4rem' }}>

            {/* LEFT */}
            <div style={{ flex: '1 1 340px' }}>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', border: '1px solid var(--border)', padding: '.35rem .9rem', marginBottom: '2.5rem', borderRadius: '30px', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--white)', animation: 'blink 2.5s ease-in-out infinite' }} />
                <span style={{ fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dim)', fontFamily: "'DM Mono',monospace" }}>Exploring the AI Frontier</span>
              </div>

              {/* Name */}
              <div className="display" style={{ fontSize: 'clamp(2.8rem,6.5vw,5.5rem)', lineHeight: .97, marginBottom: '.25rem' }}>Sai Sankar</div>
              <div className="display serif-it" style={{ fontSize: 'clamp(2.8rem,6.5vw,5.5rem)', color: 'var(--dimmer)', marginBottom: '1.75rem', lineHeight: .97 }}>Dokku.</div>

              {/* Typewriter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '1.6rem', minHeight: '1.5rem' }}>
                <span style={{ fontSize: '.6rem', color: 'var(--dimmer)', fontFamily: "'DM Mono',monospace" }}>—</span>
                <span style={{ fontSize: '.65rem', letterSpacing: '.1em', color: 'var(--dim)', fontFamily: "'DM Mono',monospace" }}>{role}</span>
                <span className="blink" style={{ color: 'var(--dim)', fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>|</span>
              </div>

              <p style={{ ...p(), maxWidth: '480px', marginBottom: '2.5rem' }}>
                AI architect engineering intelligent systems that bridge Generative AI models with real-world enterprise integration.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.85rem', alignItems: 'center' }}>
                <button className="btn" onClick={() => scrollTo('projects')} data-hover>
                  <span>View Work</span><span><Arrow /></span>
                </button>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <a href="https://github.com/Sai081" target="_blank" rel="noopener noreferrer" className="ibtn" data-hover><Github /></a>
                  <a href="https://www.linkedin.com/in/sai-sankar-dokku-0586a1289" target="_blank" rel="noopener noreferrer" className="ibtn" data-hover><Linkedin /></a>
                  <a href="https://www.instagram.com/saisankar.co" target="_blank" rel="noopener noreferrer" className="ibtn" data-hover><Insta /></a>
                </div>
              </div>
            </div>

            {/* RIGHT — Auto-Rotating Image with Spinning Rings */}
            <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', position: 'relative' }}>
              {/* Spinning Rings */}
              <div style={{ position: 'absolute', inset: -24, borderRadius: '50%', border: '1px dashed rgba(244,242,238,0.15)', animation: 'spin-slow 25s linear infinite', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: -48, borderRadius: '50%', border: '1px dotted rgba(244,242,238,0.1)', animation: 'spin-rev 35s linear infinite', pointerEvents: 'none' }} />

              <div
                className="hero-img-wrap"
                style={{
                  position: 'relative',
                  width: 'clamp(220px,25vw,340px)',
                  height: 'clamp(220px,25vw,340px)',
                  borderRadius: '50%',
                  background: 'var(--black)',
                  border: '1px solid var(--border-mid)',
                  overflow: 'hidden',
                  cursor: 'none',
                  boxShadow: '0 0 50px rgba(255,255,255,0.02)'
                }}
                onClick={() => setHeroImgIdx(p => (p + 1) % 2)}
                data-hover
              >
                {heroImgs.map((img, i) => (
                  <img
                    key={img}
                    src={img}
                    alt={`Sai Sankar ${i + 1}`}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      opacity: heroImgIdx === i ? 1 : 0,
                      transform: heroImgIdx === i ? 'scale(1)' : 'scale(1.05)',
                      transition: 'opacity 1.2s ease, transform 1.2s ease',
                      display: 'block'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rv" style={{ marginTop: '6rem', display: 'flex', flexWrap: 'wrap', borderTop: '1px solid var(--border)' }}>
            {[['1+', 'Years building AI'], ['3+', 'AI projects'], ['5+', 'Open models tested'], ['∞', 'Curiosity']].map(([n, l], i) => (
              <div key={l} style={{ flex: '1 1 110px', padding: '1.5rem 2rem', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div className="display" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.6rem)', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: '.52rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--dim)', marginTop: '.5rem', fontFamily: "'DM Mono',monospace" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="mq-wrap rv" style={{ position: 'relative', zIndex: 2 }}>
        <div className="mq-track">
          {[...mqItems, ...mqItems].map((item, i) => (
            <div key={i} className="mq-item"><div className="mq-dot" />{item}</div>
          ))}
        </div>
      </div>

      {/* ── ABOUT (1) ── */}
      <section id="about" className="sec" style={{ position: 'relative', zIndex: 2 }}>
        <div className="sec-inner">
          <div className="lbl rv">01 — About</div>
          <h2 className="display rv" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: '2.75rem' }}>The <span className="serif-it">Mindset.</span></h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1px', marginBottom: '1px' }}>
            <div className="card rv" style={{ gridColumn: 'span 2' }}>
              <p style={p()}>Final-year AI Engineering student from India, deeply fascinated by the limitless potential of Large Language Models. AI isn't just an academic pursuit — it's a relentless obsession with how intelligence can be engineered, scaled, and deployed in the real world.</p>
            </div>
            <div className="card rv">
              <p style={p()}>I thrive at the intersection of research and rapid prototyping. Whether experimenting with open-source models or architecting enterprise pipelines, I believe the best way to understand the future is to <em style={{ color: 'var(--white)', fontStyle: 'italic' }}>build it yourself.</em></p>
            </div>
          </div>

          {/* 4 pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1px', border: '1px solid var(--border)', marginTop: '1px', marginBottom: '2rem' }}>
            {[
              { title: 'GenAI Enthusiast', sub: 'Fine-tuning · RAG · Open Models' },
              { title: 'Enterprise Integrator', sub: 'SAP CPI · Secure Pipelines' },
              { title: 'Rapid Builder', sub: 'Python · APIs · Prototyping' },
              { title: 'Model Tinkerer', sub: 'CodeT5 · Qwen · DeepSeek' },
            ].map(({ title, sub }, i) => (
              <div key={title} className="rv" style={{ padding: '1.6rem 1.4rem', borderRight: i < 3 ? '1px solid var(--border)' : 'none', transition: 'background .3s', background: 'rgba(244,242,238,0.01)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,242,238,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,242,238,0.01)'}
              >
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '.9rem', color: 'var(--white)', marginBottom: '.5rem', fontWeight: 500 }}>{title}</div>
                <div style={{ fontSize: '.55rem', letterSpacing: '.1em', color: 'var(--dim)', fontFamily: "'DM Mono',monospace" }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Advantage */}
          <div className="rv" style={{ padding: '1.75rem 2rem', borderLeft: '2px solid rgba(244,242,238,0.3)', paddingLeft: '1.75rem', marginLeft: '.25rem', background: 'rgba(244,242,238,0.02)' }}>
            <div style={{ fontSize: '.52rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--dimmer)', marginBottom: '.65rem', fontFamily: "'DM Mono',monospace" }}>◈ Unfair Advantage</div>
            <p style={p()}>
              A rare synthesis: cutting-edge <span style={{ color: 'var(--white)' }}>Generative AI (LLMs & RAG)</span> knowledge fused with rigorous <span style={{ color: 'var(--white)' }}>Enterprise Integration (SAP CPI)</span> expertise. I don't just build smart models — I embed them safely into massive corporate infrastructures.
            </p>
          </div>
        </div>
      </section>

      {/* ── SKILLS (2) ── */}
      <section id="skills" className="sec" style={{ position: 'relative', zIndex: 2 }}>
        <div className="sec-inner">
          <div className="lbl rv">02 — Arsenal</div>
          <h2 className="display rv" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: '2.75rem' }}>Technical <span className="serif-it">Skills.</span></h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '4rem' }}>
            <div className="rv" style={{ minWidth: 0 }}>
              {skills.map(s => <SkillBar key={s.name} {...s} />)}
            </div>
            <div className="rv" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { label: 'Intelligence', items: ['LLM Fine-tuning', 'RAG Architecture', 'Dataset Handling', 'AI System Design', 'Prompt Engineering', 'Agentic Frameworks'] },
                { label: 'Integration', items: ['SAP CPI', 'Enterprise Architecture', 'SFTP Pipelines', 'PGP Encryption'] },
                { label: 'Execution', items: ['Python', 'RESTful APIs', 'JSON / XML', 'Local Model Deployment'] },
              ].map(({ label, items }) => (
                <div key={label}>
                  <div style={{ fontSize: '.52rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--dimmer)', marginBottom: '.75rem', fontFamily: "'DM Mono',monospace", borderBottom: '1px solid var(--border)', paddingBottom: '.4rem' }}>{label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.38rem' }}>
                    {items.map(it => <span key={it} className="tag">{it}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rv" style={{ marginTop: '2.5rem', padding: '1.5rem 2rem', border: '1px solid var(--border)', display: 'flex', gap: '1.25rem', alignItems: 'flex-start', background: 'rgba(244,242,238,0.015)' }}>
            <span style={{ fontSize: '.6rem', color: 'var(--white)', flexShrink: 0, marginTop: '.2rem' }}>→</span>
            <div>
              <div style={{ fontSize: '.52rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dimmer)', fontFamily: "'DM Mono',monospace", marginBottom: '.5rem' }}>Current Focus</div>
              <p style={p()}>
                Deeply immersed in <span style={{ color: 'var(--white)' }}>agentic AI frameworks</span>, <span style={{ color: 'var(--white)' }}>multimodal LLMs</span>, and production-grade RAG pipelines. Always chasing the bleeding edge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS (3) ── */}
      <section id="projects" className="sec" style={{ position: 'relative', zIndex: 2 }}>
        <div className="sec-inner">
          <div className="lbl rv">03 — Work</div>
          <h2 className="display rv" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: '2.75rem' }}>The Magnum <span className="serif-it">Opus.</span></h2>

          <div className="rv card" style={{ padding: 'clamp(1.5rem,4vw,3rem)', position: 'relative' }}>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.45rem', marginBottom: '1.6rem' }}>
              <span className="tag">Final-Year Highlight</span>
              <span className="tag">End-to-End System</span>
              <span className="tag">Multi-Pipeline</span>
            </div>

            <h3 className="display" style={{ fontSize: 'clamp(1.3rem,2.8vw,2rem)', marginBottom: '1rem', fontWeight: 700, lineHeight: 1.1 }}>
              AI-Powered Code Translation<br />
              <span className="serif-it" style={{ color: 'var(--dimmer)' }}>& Explanation Engine.</span>
            </h3>

            <p style={{ ...p(), maxWidth: '580px', marginBottom: '2.25rem' }}>
              A multi-pipeline intelligence system — fine-tuned CodeT5 as primary, Qwen/DeepSeek 33B as zero-shot fallbacks, and a RAG layer for semantic code explanation. Translates syntax (Python → Java, etc.) and explains logic line-by-line.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '1px', border: '1px solid var(--border)' }}>
              {[
                { title: 'Fine-Tuned Core', rows: [['Model', 'CodeT5'], ['Data', 'CodeXGLUE / CoNaLa'], ['Task', 'Syntax Translation']] },
                { title: 'Baseline & Fallback', rows: [['Models', 'Qwen / DeepSeek 33B'], ['Type', 'Zero / Few-Shot'], ['Role', 'Alt Pipelines']] },
                { title: 'RAG Architecture', rows: [['Function', 'Context Parsing'], ['Output', 'Semantic Logic'], ['Benefit', 'Deep Explanation']] },
              ].map(({ title, rows }, i) => (
                <div key={title} style={{ padding: '1.4rem', borderRight: i < 2 ? '1px solid var(--border)' : 'none', background: 'rgba(8,8,8,0.5)' }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '.85rem', color: 'var(--white)', marginBottom: '.9rem', fontWeight: 500 }}>{title}</div>
                  {rows.map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(244,242,238,.05)', padding: '.38rem 0', fontSize: '.58rem', fontFamily: "'DM Mono',monospace" }}>
                      <span style={{ color: 'var(--dim)' }}>{k}</span>
                      <span style={{ color: 'var(--off)' }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE & DISCOURSE (4) ── */}
      <section id="experience" className="sec" style={{ position: 'relative', zIndex: 2 }}>
        <div className="sec-inner">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '5rem' }}>
            <div>
              <div className="lbl rv">04 — Experience</div>
              <h2 className="display rv" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', marginBottom: '2.5rem' }}>Work<span className="serif-it">.</span></h2>
              <div className="rv" style={{ position: 'relative', paddingLeft: '1.6rem' }}>
                <div className="tl-line" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '1px', background: 'linear-gradient(to bottom,rgba(244,242,238,.25),transparent)' }} />
                <div className="tl-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--white)', position: 'absolute', left: '-3px', top: '6px' }} />
                <div style={{ fontSize: '.52rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dimmer)', marginBottom: '.45rem', fontFamily: "'DM Mono',monospace" }}>VKollab Technologies Pvt. Ltd</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 500, color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>SAP Technical Consultant</h3>
                <p style={{ ...p(), marginBottom: '1.1rem' }}>
                  Architected real-time enterprise integration scenarios, orchestrating sensitive customer data synchronization and business logic via SAP Cloud Platform Integration.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                  {['SAP CPI', 'Enterprise Integration', 'Cloud Architecture'].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </div>

            <div>
              <div className="lbl rv">05 — Discourse</div>
              <h2 className="display rv" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', marginBottom: '2.5rem' }}>Research<span className="serif-it">.</span></h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', border: '1px solid var(--border)' }}>
                {[
                  { n: '01', title: 'Autonomous AI Agents', desc: 'Multi-agent systems, tool-use capabilities, and autonomous reasoning loops for enterprise applications.', tag: 'Architecture' },
                  { n: '02', title: 'LLM Fine-Tuning Paradigms', desc: 'PEFT, LoRA, and strategies for aligning open-source foundation models to domain-specific tasks.', tag: 'Optimization' },
                  { n: '03', title: 'Multimodal AI Systems', desc: 'Vision-language models and cross-modal reasoning for richer, more capable AI applications.', tag: 'Research' },
                ].map(({ n, title, desc, tag }) => (
                  <div key={n} className="rv" style={{ padding: '1.4rem', borderBottom: '1px solid var(--border)', transition: 'background .3s', background: 'rgba(244,242,238,.01)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,242,238,.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,242,238,.01)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.55rem' }}>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '.55rem', color: 'var(--dim)' }}>{n}</span>
                      <span className="tag" style={{ padding: '.2rem .5rem', fontSize: '.48rem' }}>{tag}</span>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 500, color: 'var(--white)', fontSize: '.95rem', marginBottom: '.45rem' }}>{title}</div>
                    <p style={p({ fontSize: '.68rem', lineHeight: 1.85 })}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY (5) ── */}
      <section id="gallery" className="sec" style={{ position: 'relative', zIndex: 2 }}>
        <div className="sec-inner">
          <div className="lbl rv">06 — Gallery</div>
          <h2 className="display rv" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: '2.25rem' }}>Beyond the <span className="serif-it">Code.</span></h2>

          {/* Full Color Flex Expansion Gallery */}
          <div className="rv" style={{ display: 'flex', height: '55vh', minHeight: '360px', gap: '0.6rem' }}>
            {galImgs.map((src, i) => {
              const hov = hovGal === i;
              const any = hovGal !== null;
              return (
                <div key={i} className="gal-item"
                  style={{ flex: hov ? 3.5 : (any ? 0.7 : 1), borderColor: hov ? 'var(--white)' : 'var(--border)' }}
                  onMouseEnter={() => setHovGal(i)}
                  onMouseLeave={() => setHovGal(null)}
                  onClick={() => setLightbox(src)}
                  data-hover
                >
                  {/* Full color photos */}
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform .8s cubic-bezier(.16,1,.3,1)', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.7), transparent)', opacity: hov ? 0 : 1, transition: 'opacity .5s', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', opacity: hov ? 1 : 0, transition: 'opacity .4s', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                    <span style={{ background: 'rgba(8,8,8,.8)', border: '1px solid var(--border)', padding: '.3rem 1rem', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--white)', fontFamily: "'DM Mono',monospace", borderRadius: '20px' }}>Expand</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── CONTACT (6) ── */}
      <section id="contact" className="sec" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div className="lbl rv" style={{ justifyContent: 'center' }}>07 — Contact</div>
          <h2 className="display rv" style={{ fontSize: 'clamp(2.4rem,5.5vw,5rem)', marginBottom: '1.2rem' }}>
            Let's <span className="serif-it" style={{ color: 'var(--dimmer)' }}>build</span><br />something.
          </h2>
          <p className="rv" style={{ ...p({ textAlign: 'center' }), maxWidth: '360px', margin: '0 auto 2.75rem' }}>
            Ready to architect the next generation of intelligent systems? Open for collaborations, roles, and high-signal discourse.
          </p>

          <div className="rv" style={{ display: 'flex', justifyContent: 'center', gap: '.6rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            <a href="https://github.com/Sai081" target="_blank" rel="noopener noreferrer" className="ibtn" data-hover><Github /></a>
            <a href="https://www.linkedin.com/in/sai-sankar-dokku-0586a1289" target="_blank" rel="noopener noreferrer" className="ibtn" data-hover><Linkedin /></a>
            <a href="https://www.instagram.com/saisankar.co" target="_blank" rel="noopener noreferrer" className="ibtn" data-hover><Insta /></a>
          </div>

          <div className="rv">
            <a href="https://www.linkedin.com/in/sai-sankar-dokku-0586a1289" target="_blank" rel="noopener noreferrer" className="btn" data-hover>
              <span>Start a Conversation</span><span><Arrow /></span>
            </a>
          </div>

          {/* Minimal Terminal */}
          <div className="rv" style={{ marginTop: '4rem', textAlign: 'left', border: '1px solid var(--border)', padding: '1.5rem', background: 'rgba(8,8,8,0.5)', borderRadius: '6px' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.45rem' }}>
              {[0, 1, 2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-mid)', display: 'block' }} />)}
              <span style={{ fontSize: '.5rem', letterSpacing: '.14em', color: 'var(--dimmer)', fontFamily: "'DM Mono',monospace", marginLeft: '.4rem' }}>terminal — sai@neural:~</span>
            </div>
            {[
              ['whoami', 'sai-sankar-dokku // AI engineer & architect'],
              ['cat interests.txt', 'LLMs, RAG, agents, enterprise AI, open-source models'],
              ['echo $STATUS', 'OPEN_TO_OPPORTUNITIES=true // BUILDING_IN_PUBLIC=true'],
            ].map(([cmd, out]) => (
              <div key={cmd} style={{ marginBottom: '.85rem' }}>
                <div style={{ fontSize: '.65rem', fontFamily: "'DM Mono',monospace", color: 'var(--white)', marginBottom: '.2rem' }}>
                  <span style={{ color: 'var(--dimmer)' }}>❯ </span>{cmd}
                </div>
                <div style={{ fontSize: '.6rem', fontFamily: "'DM Mono',monospace", color: 'var(--dim)', paddingLeft: '1rem' }}>{out}</div>
              </div>
            ))}
            <div style={{ fontSize: '.65rem', fontFamily: "'DM Mono',monospace", color: 'var(--white)' }}>
              <span style={{ color: 'var(--dimmer)' }}>❯ </span><span className="blink" style={{ color: 'var(--dimmer)' }}>█</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '1rem', color: 'var(--dimmer)' }}>Sai Sankar.</div>
        <div style={{ fontSize: '.52rem', letterSpacing: '.14em', color: 'var(--dim)', fontFamily: "'DM Mono',monospace" }}>Designed & engineered © {new Date().getFullYear()}</div>
        <div style={{ fontSize: '.52rem', letterSpacing: '.12em', color: 'var(--dim)', fontFamily: "'DM Mono',monospace" }}>v4.0</div>
      </footer>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="lb" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: '1px solid var(--border)', color: 'var(--white)', cursor: 'none', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .3s', borderRadius: '50%' }} data-hover
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          ><Close /></button>
          <img src={lightbox} alt="Expanded" style={{ maxWidth: '88vw', maxHeight: '86vh', objectFit: 'contain', display: 'block' }} onClick={e => e.stopPropagation()} />
        </div>
      )}

      <ChatBot />
    </div>
  );
}