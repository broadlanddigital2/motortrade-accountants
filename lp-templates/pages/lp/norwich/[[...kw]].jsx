// Norwich location page, pre-rendered once per keyword variant:
//   /lp/norwich/             → "Motor Trade" wording (default)
//   /lp/norwich/automotive/  → "Automotive" wording
// The Worker redirects /lp/norwich/?kw=automotive to the matching path, keeping every query parameter.
import LocationTemplate from '../../../templates/LocationTemplate';
import { locationProps } from '../../../lib/keywords';

export default LocationTemplate;

export function getStaticPaths() {
  return { paths: [{ params: { kw: [] } }, { params: { kw: ['automotive'] } }], fallback: false };
}

export function getStaticProps({ params }) {
  return { props: locationProps(params.kw?.[0]) };
}
