import { useEffect, useState } from 'react';
export { default as TrustBand } from './TrustBand';

export function PageShell({margin = false, children}) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const update = () => setCompact(window.scrollY > 30);
    update(); window.addEventListener('scroll', update, {passive: true});
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <div className={`${margin ? 'margin-page' : 'location-page'}${compact ? ' compact' : ''}`}>{children}</div>;
}
export function SiteHeader({margin = false}) {
 return <header><div className="wrap head"><img src="/assets/logo.png" alt="The Motortrade Accountants" width="245" height="56" /><div><a className="phone" href="tel:01603904131">01603 904131</a><a className="button" href={margin ? '#check' : '#discovery'}>{margin ? 'Book my free check' : 'Book a free call'} <span aria-hidden="true">→</span></a></div></div></header>;
}
export function SiteFooter({margin = false}) {
 return <footer><div className="wrap footer-grid"><div><img src="/assets/white-logo.png" width="245" height="60" alt="The Motortrade Accountants" /><p>Part of Swinton Accountants<br />ICAS member</p></div><div><p>Park Farm Business Park, Park Farm Hotel<br />Norwich Road, Hethersett, Norwich<br />Norfolk NR9 3DL</p></div><div><a href="https://themotortradeaccountants.co.uk/privacy-policy/">Privacy policy</a><a href="https://themotortradeaccountants.co.uk/cookie-policy/">Cookies</a><a href="https://themotortradeaccountants.co.uk/website-terms-of-use/">Terms of use</a></div></div><div className="wrap footer-end">{margin && <>General guidance based on HMRC’s published rules. Not advice for your specific circumstances.<br /></>}© The Motortrade Accountants · Registered in England &amp; Wales · Company number 03781302</div></footer>;
}
export function Faqs({items}) {
 const schema = {'@context':'https://schema.org','@type':'FAQPage',mainEntity:items.map(([q,a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};
 return <div className="faq-items">{items.map(([q,a],i) => <details key={q} open={i===0}><summary>{q}</summary><p>{a}</p></details>)}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}} /></div>;
}
