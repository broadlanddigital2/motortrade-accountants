// National launch page (generic ad groups), pre-rendered once per keyword variant:
//   /lp/uk/              → "Motor Trade Accountants across the UK." (default)
//   /lp/uk/automotive/   → "Automotive Accountants across the UK."
//   /lp/uk/dealership/   → "Dealership Accountants across the UK."
//   /lp/uk/used-car/     → "Used Car Dealer Accountants across the UK."
// The Worker redirects /lp/uk/?kw=<variant> to the matching path, keeping every query parameter.
import LocationTemplate from '../../../templates/LocationTemplate';
import { placeProps } from '../../../lib/places';

export default LocationTemplate;

export function getStaticPaths() {
  return {
    paths: [{ params: { kw: [] } }, { params: { kw: ['automotive'] } }, { params: { kw: ['dealership'] } }, { params: { kw: ['used-car'] } }],
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return { props: placeProps('uk', params.kw?.[0]) };
}
