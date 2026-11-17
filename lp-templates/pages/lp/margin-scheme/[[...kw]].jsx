// VAT margin scheme page, pre-rendered once per keyword variant:
//   /lp/margin-scheme/                    → "VAT Margin Scheme Accountants" wording (default)
//   /lp/margin-scheme/vat-margin-scheme/  → research wording
//   /lp/margin-scheme/second-hand/        → second-hand wording
// The Worker redirects /lp/margin-scheme/?kw=<variant> to the matching path, keeping every query parameter.
import MarginTemplate from '../../../templates/MarginTemplate';
import { marginProps } from '../../../lib/keywords';

export default MarginTemplate;

export function getStaticPaths() {
  return {
    paths: [{ params: { kw: [] } }, { params: { kw: ['vat-margin-scheme'] } }, { params: { kw: ['second-hand'] } }],
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return { props: marginProps(params.kw?.[0]) };
}
