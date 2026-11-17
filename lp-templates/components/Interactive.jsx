import { useRef, useState } from 'react';
import { sectorGroups, painGroups, services } from '../data/content.json';
import { useCheck } from './LeadForm';
export function SectorCards() {
 return <div className="sectors" id="sectors">{sectorGroups.map(([im,alt,n,t,p,tags]) => <article className="sector photo-sector" key={t}><div className="sector-image"><img src={`/assets/${im}`} alt={alt} loading="lazy" /><span>{n}</span></div><div className="sector-content"><h3>{t}</h3><p>{p}</p><div className="sector-tags">{tags.map(x=><span key={x}>{x}</span>)}</div></div></article>)}</div>;
}
export function PainGroups() {
 return <div className="pain-groups" id="pain">{painGroups.map(([n,t,p,r]) => <article className="pain-group" key={n}><span className="pain-index">{n}</span><div><h3>{t}</h3><p>{p}</p><span className="pain-resolution">{r}</span></div></article>)}</div>;
}
export function ServiceExplorer() {
 const [selected,setSelected] = useState(0);
 const refs = useRef([]);
 const [title,heading,copy,tags,image,alt] = services[selected];
 function keyboard(event,index) {
  let next = index;
  if (event.key==='ArrowDown'||event.key==='ArrowRight') next=(index+1)%services.length;
  else if (event.key==='ArrowUp'||event.key==='ArrowLeft') next=(index+services.length-1)%services.length;
  else if (event.key==='Home') next=0;
  else if (event.key==='End') next=services.length-1;
  else return;
  event.preventDefault(); setSelected(next); refs.current[next].focus();
 }
 return <div className="service-explorer" id="services"><div className="service-menu" role="tablist" aria-label="Explore our services" aria-orientation="vertical">{services.map(([title],i)=><button type="button" key={title} ref={el=>{refs.current[i]=el;}} className="service-tab" role="tab" id={`service-tab-${i}`} aria-controls="service-panel" aria-selected={selected===i} tabIndex={selected===i ? 0 : -1} onClick={()=>setSelected(i)} onKeyDown={e=>keyboard(e,i)}><span className="service-no">{String(i+1).padStart(2,'0')}</span><span>{title}</span><span className="service-arrow" aria-hidden="true">+</span></button>)}</div><section className="service-panel" id="service-panel" role="tabpanel" tabIndex={0} aria-labelledby={`service-tab-${selected}`}><div className="service-photo"><img src={`/assets/${image}`} alt={alt} loading="lazy" /><span className="service-counter">{String(selected+1).padStart(2,'0')} / 08</span></div><div className="service-detail"><p className="eyebrow">{title}</p><h3>{heading}</h3><p>{copy}</p><ul>{tags.map(t=><li key={t}>{t}</li>)}</ul><a href="#discovery" className="button">Let’s talk about your business <span aria-hidden="true">→</span></a></div></section></div>;
}
const questions=[
 ['Purchase price','Are repairs, preparation and overheads excluded from your purchase price?','These costs do not increase the vehicle purchase price used for the scheme.'],
 ['MOT treatment','Are you keeping the MOT in the full selling price?','Don’t subtract its value when working out the margin.'],
 ['Eligible stock','Are you checking every vehicle is eligible?','New cars and separately VAT-invoiced purchases are excluded. Imports are normally excluded, with limited exceptions.'],
 ['Part-exchanges','Are you carrying the agreed part-exchange value into the next purchase price?','The agreed value forms part of the original sale and the next vehicle’s purchase price.'],
 ['Vehicle records','Do invoices and stock entries identify each vehicle?','Include make/model and the registration number, or VIN if there is no registration.'],
];
export function SelfCheck() {
 const {answers,setAnswers} = useCheck();
 const answered = answers.filter(Boolean).length;
 const score = answers.filter(a=>a && a!=='yes').length;
 const message = answered===0 ? 'Two or more “No” or “Not sure”? Book a free check.' : answered<5 ? 'Keep going to see where a specialist check could help.' : score>=2 ? `${score} answers to take a closer look at. Let’s check your margin scheme.` : score===1 ? 'One point worth a closer look. A free check can help.' : 'Your answers look encouraging. A review of your records can help confirm the detail.';
 return <form id="self-form" className="self-form" onSubmit={e=>e.preventDefault()}>{questions.map(([title,q,explanation],i)=><fieldset className="check-row" key={title}><legend><span>{String(i+1).padStart(2,'0')}</span> {title}</legend><div className="check-question"><p>{q}</p><small>{explanation}</small></div><div className="choices">{[['yes','Yes'],['no','No'],['unsure','Not sure']].map(([value,label])=><label key={value}><input type="radio" name={`answer-${i}`} value={value} checked={answers[i]===value} onChange={()=>setAnswers(previous=>previous.map((v,j)=>i===j ? value : v))} /><span>{label}</span></label>)}</div></fieldset>)}<div className={`check-result${answered>=3 ? ' engaged' : ''}`}><div><span id="check-progress">{answered} OF 5 ANSWERED</span><p id="check-result" role="status" aria-live="polite">{message}</p><small>A starting point for a conversation, not a compliance assessment.</small></div><a href="#check" className="button dark">Check my margin scheme <span>→</span></a></div></form>;
}
