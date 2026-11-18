import { Html, Head, Main, NextScript } from 'next/document';

// CRM enquiry bot (Motortrade Accountants channel in the Race Car Graphics CRM). Leads go to the CRM's
// "Motortrade Accountants leads" pipeline. "teaser" shows a small card by the chat button instead of
// opening the full chat over the form.
const BOT_KEY = 'a7a116f5-add8-4331-9677-eb54d7671312';

export default function Document() {
  return (
    <Html lang="en-GB">
      <Head />
      <body>
        <Main />
        <NextScript />
        <script src="https://crm.racecargraphics.uk/rcg-enquiry-bot.js" data-bot-key={BOT_KEY} data-auto-open="teaser" defer />
      </body>
    </Html>
  );
}
