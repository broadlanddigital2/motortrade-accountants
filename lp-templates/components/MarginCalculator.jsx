import { useEffect, useRef, useState } from 'react';

// VAT margin scheme calculator for a single eligible used vehicle at the standard 20% rate.
// VAT due = margin x 1/6, where margin = selling price - purchase price. No VAT on a loss.
// Illustration only; based on HMRC's published margin scheme guidance.

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 });
const money = n => gbp.format(Math.round(n * 100) / 100);
const parse = v => {
  const n = parseFloat(String(v).replace(/[£,\s]/g, ''));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

function Field({ id, label, hint, value, onChange }) {
  return (
    <div className="calc-field">
      <label htmlFor={id}>{label}</label>
      <div className="calc-input">
        <span aria-hidden="true">£</span>
        <input id={id} type="text" inputMode="decimal" autoComplete="off" value={value} onChange={e => onChange(e.target.value)} aria-describedby={`${id}-hint`} />
      </div>
      <small id={`${id}-hint`}>{hint}</small>
    </div>
  );
}

export default function MarginCalculator() {
  const [bought, setBought] = useState('8,000');
  const [sold, setSold] = useState('10,000');
  const [prep, setPrep] = useState('500');
  const tracked = useRef(false);

  const purchase = parse(bought);
  const selling = parse(sold);
  const costs = parse(prep);
  const margin = selling - purchase;
  const vat = margin > 0 ? margin / 6 : 0;
  const kept = margin - vat;

  // The common mistake: adding prep and repair costs to the purchase price.
  const wrongMargin = selling - (purchase + costs);
  const wrongVat = wrongMargin > 0 ? wrongMargin / 6 : 0;
  const underDeclared = vat - wrongVat;

  useEffect(() => {
    if (tracked.current || (bought === '8,000' && sold === '10,000' && prep === '500')) return;
    tracked.current = true;
    if (typeof window !== 'undefined') (window.dataLayer = window.dataLayer || []).push({ event: 'calculator_use' });
  }, [bought, sold, prep]);

  return (
    <div className="calc">
      <div className="calc-inputs">
        <Field id="calc-bought" label="Purchase price" hint="Everything you paid for the car. Leave out repairs, prep and overheads." value={bought} onChange={setBought} />
        <Field id="calc-sold" label="Selling price" hint="Everything you received, including any part-exchange value and an MOT sold with the car." value={sold} onChange={setSold} />
        <Field id="calc-prep" label="Repairs and prep (optional)" hint="Used only to show the cost of a common mistake below." value={prep} onChange={setPrep} />
      </div>

      <div className="calc-results" role="status" aria-live="polite">
        <div className="calc-row"><span>Margin</span><strong>{money(Math.max(margin, 0))}</strong></div>
        <div className="calc-row calc-answer"><span>VAT due <small>margin ÷ 6</small></span><strong>{money(vat)}</strong></div>
        <div className="calc-row"><span>Margin after VAT</span><strong>{money(Math.max(kept, 0))}</strong></div>
        {margin <= 0 && selling > 0 && (
          <p className="calc-note">Sold at a loss or break-even: no VAT is due on this car. Under the standard margin scheme, the loss can’t be set against other sales.</p>
        )}
        {costs > 0 && underDeclared > 0.004 && (
          <div className="calc-warning">
            <strong>Watch out:</strong> adding the {money(costs)} of repairs and prep to the purchase price would cut the VAT to {money(wrongVat)}, under-declaring <b>{money(underDeclared)}</b> on this one car. HMRC excludes these costs from the margin; their VAT is reclaimed separately under normal rules.
          </div>
        )}
        <a className="button dark" href="#check">Check every sale with a free review <span aria-hidden="true">→</span></a>
        <small className="calc-disclaimer">One eligible used vehicle at the standard 20% VAT rate. Illustration only, not advice for your circumstances.</small>
      </div>
    </div>
  );
}
