import Head from 'next/head';
import '../styles/globals.css';
import '../styles/margin.css';
export default function App({Component, pageProps}) {
 return <><Head><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex,follow" /></Head><Component {...pageProps} /></>;
}
