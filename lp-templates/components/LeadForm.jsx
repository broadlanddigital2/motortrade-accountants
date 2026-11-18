import { createContext, useContext, useEffect, useRef, useState } from 'react';

const CheckContext = createContext(null);
export function CheckProvider({children}) {
 const [answers, setAnswers] = useState(Array(5).fill(null));
 return <CheckContext.Provider value={{answers,setAnswers}}>{children}</CheckContext.Provider>;
}
export function useCheck() { return useContext(CheckContext); }
const trackingKeys = ['gclid','gbraid','wbraid','utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
export function LeadForm({mode, page, heading, keyword, city = 'Norwich'}) {
 const margin = mode === 'margin' || page === 'margin-scheme';
 const quick = mode === 'quick';
 const {answers} = useCheck();
 const answered = answers.filter(Boolean).length;
 const score = answered ? answers.filter(a => a && a !== 'yes').length : '';
 const [attribution, setAttribution] = useState({});
 const [error, setError] = useState('');
 const [busy, setBusy] = useState(false);
 const modal = useRef(null);
 const formRef = useRef(null);
 useEffect(() => {
  const query = new URLSearchParams(window.location.search);
  setAttribution(Object.fromEntries(trackingKeys.map(k => [k,query.get(k)||''])));
 }, []);
 async function submit(event) {
  event.preventDefault(); setError('');
  const phone = formRef.current.elements.phone;
  const digits = phone.value.replace(/\D/g,'');
  if (digits.length < 10 || digits.length > 15) { setError('Please enter a valid phone number with 10–15 digits.'); phone.focus(); return; }
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
  if (!endpoint) { modal.current.showModal(); return; }
  setBusy(true);
  try {
   const payload = Object.fromEntries(new FormData(formRef.current));
   payload.landing_url = window.location.href;
   payload.timestamp = new Date().toISOString();
   const response = await fetch(endpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   if (!response.ok) throw new Error('Submission failed');
   const redirect = process.env.NEXT_PUBLIC_THANK_YOU_URL;
   if (redirect) window.location.assign(redirect);
   else setError('Your request was submitted. Thank you — we’ll be in touch within 24 hours.');
  } catch { setError('We couldn’t send your request. Please try again or call 01603 904131.'); }
  finally { setBusy(false); }
 }
 const fields = <>
  <label>Full name<input name="name" autoComplete="name" placeholder="Your full name" required /></label>
  {quick ? <label>Phone number<input type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" required /></label> : <div className="form-grid"><label>Phone number<input type="tel" name="phone" autoComplete="tel" placeholder="Your phone number" required /></label><label>Email address<input type="email" name="email" autoComplete="email" placeholder="you@business.co.uk" required /></label></div>}
 </>;
 return <>
 <form ref={formRef} id={quick ? undefined : margin ? 'check' : 'discovery'} className={quick ? 'quick' : 'form-card'} onSubmit={submit} data-lead-form>
  {!quick && <><p className="eyebrow">{margin ? 'FREE. SPECIALIST. NO OBLIGATION.' : 'LET’S TALK ABOUT YOUR BUSINESS'}</p><h2 id={margin ? 'form-heading' : undefined}>{heading}</h2><p>{margin ? 'A clearer picture starts with a conversation.' : 'Tell us a little about yourself. We’ll take it from there.'}</p></>}
  {fields}
  {!quick && (margin ? <>
   <label>Cars sold per month<select name="cars_sold" defaultValue="" required><option value="">Select monthly sales</option>{['Under 10','10–30','30–100','100+'].map(v=><option key={v}>{v}</option>)}</select></label>
   <label>VAT registered?<select name="vat_registered" defaultValue="" required><option value="">Please select</option>{['Yes','No','Not sure'].map(v=><option key={v}>{v}</option>)}</select></label>
  </> : <>
   <label>Business type<select name="business" defaultValue="" required><option value="">Select your business type</option>{['Used car dealer','Dealership group','Garage or workshop','Body shop','Other'].map(v=><option key={v}>{v}</option>)}</select></label>
   <label>Annual turnover <span className="optional">(optional)</span><select name="turnover" defaultValue=""><option value="">Select annual turnover</option>{['Under £100k','£100k–£250k','£250k–£500k','£500k–£1m','£1m–£2m','£2m–£5m','£5m–£15m','Over £15m'].map(v=><option key={v}>{v}</option>)}</select></label>
   <label className="check"><input type="checkbox" name="newsletter" value="yes" /> Send me occasional news and motor trade insights.</label>
  </>)}
  <input type="hidden" name="page" value={margin ? 'margin-scheme' : 'location'} />
  {!margin && <input type="hidden" name="city" value={city} />}
  <input type="hidden" name="kw" value={keyword} />
  {margin && <><input type="hidden" name="self_check_score" value={score} /><input type="hidden" name="self_check_answered" value={answered} /></>}
  {trackingKeys.map(k => <input key={k} type="hidden" name={k} value={attribution[k] || ''} />)}
  <button type="submit" className={`button${quick ? ' dark' : ''}`} disabled={busy}>{busy ? 'Sending…' : margin ? 'Book my free check' : quick ? 'Request my free call' : 'Get my free call'}<span aria-hidden="true">→</span></button>
  {!quick && <p className="small centred">{margin ? "We'll be in touch within 24 hours. No obligation." : 'Within 24 hours. No obligation.'}<br />Your details are handled under our <a href="https://themotortradeaccountants.co.uk/privacy-policy/">privacy policy</a>.</p>}
  {error && <p className="form-message" role="status">{error}</p>}
 </form>
 <dialog ref={modal} aria-label="Form preview"><button type="button" className="close" aria-label="Close preview" onClick={()=>modal.current.close()}>×</button><p className="eyebrow">DESIGN PREVIEW</p><h2>Your next step is ready.</h2><p>Enquiry delivery and appointment booking will be connected before launch.</p><p>No details have been sent or saved.</p><button type="button" className="button" onClick={()=>modal.current.close()}>Back to the page</button></dialog>
 </>;
}
export function StickyActions({margin=false}) {
 const [hidden, setHidden] = useState(false);
 useEffect(() => {
  const forms = document.querySelectorAll('[data-lead-form]');
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {entries.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));setHidden(visible.size>0);});
  forms.forEach(f => observer.observe(f));
  return () => observer.disconnect();
 }, []);
 return <div className={`mobile-bar${hidden ? ' hidden' : ''}`}><a href="tel:01603904131">Call 01603 904131</a><a href={margin ? '#check' : '#discovery'}>{margin ? 'Book my free check' : 'Book a free call'} →</a></div>;
}
