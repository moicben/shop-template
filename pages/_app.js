import '@styles/globals.css';
import '../styles/products.css';
import '../styles/product-page.css';
import '../styles/responsive.css';
import '../styles/header.css';
import '../styles/footer.css';
import '../styles/help.css';
import '../styles/follow-order.css';
import '../styles/reviews.css';	
import '../styles/partners.css';
import '../styles/checkout.css';
import '../styles/ReviewsBadge.css';
import '../styles/contact.css';
import '../styles/ScrollingBanner.css'; 
import '../styles/Categories.css';
import '../styles/about.css';
import '../styles/Testimonials.css';
import '../styles/SimulatorPopup.css';
import '../styles/Certifications.css';
import '../styles/wedinery.css';
import '../styles/landing.css';

import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

import Head from '../components/Head';


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head />
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default MyApp;