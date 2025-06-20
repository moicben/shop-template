import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';

import Header from '../components/Header';
import Head from '../components/Head';
import Footer from '../components/Footer';
import About from '../components/About';
import Reviews from '../components/Reviews';
import Testimonials from '../components/Testimonials';

import { fetchData } from '../lib/supabase.mjs';

const Contact = ({ shop,brand, data, categories, reviews }) => {
  const [cartCount, setCartCount] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(storedCart.length);
  }, []);

  
  useEffect(() => {
    emailjs.init("8SL7vzVHt7qSqEd4i");
    
    // Add Google Ads conversion tracking script
    const script = document.createElement('script');
    script.innerHTML = `
      function gtag_report_conversion(url) {
        var callback = function () {
          if (typeof(url) != 'undefined') {
            window.location = url;
          }
        };
        gtag('event', 'conversion', {
            'send_to': '${shop.tag}/${shop.tagContact}',
            'value': 5.0,
            'currency': 'EUR',  
            'event_callback': callback
        });
        return false;
      }
    `;
    document.head.appendChild(script);
    
    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formObject = Object.fromEntries(formData.entries());

    emailjs.send('gmail-benedikt', 'new-contact', formObject)
      .then(() => {
        setFormSubmitted(true);
        // Track Google Ads conversion
        if (typeof window.gtag_report_conversion === 'function') {
          window.gtag_report_conversion();
        }
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
      });

    e.target.reset();
  };

  return (
    <div className="container">
      <Head name={shop.name} domain={shop.domain} tag={shop.tag} pixel={shop.pixel} hotjar={shop.hotjar}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`${data.contactPageLabel} - ${shop.name}`}
      />
      
      <main>
      <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
      <section className="contact" id="contact">
        <div className="wrapper">
          <div className="contact-content">
            <h2>{data.contactPageTitle}</h2>
            <p>{data.contactPageDesc}</p>
            <br></br>
            <p><i className="fas fa-map-marker-alt"></i> {shop.address}</p>
            <p><i className="fas fa-envelope"></i> support@{shop.domain.toLowerCase()}</p>
            <p><i className="fas fa-phone"></i> +44 7832 482 622</p>
          </div>
          <div className="contact-form">
            {formSubmitted ? (
              <p className="confirmation">
                {data.contactSuccessMessage}
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">{data.inputFullNameLabel}</label>
                <input
                  placeholder={data.inputFullNameHolder}
                  type="text"
                  id="name"
                  name="name"
                  required
                />

                <div className="row-form">
                  <label htmlFor="email">
                    <span>{data.inputEmailLabel}</span>
                    <input
                      placeholder={data.inputEmailHolder}
                      type="email"
                      id="email"
                      name="email"
                      required
                    />
                  </label>
                  <label htmlFor="phone">
                    <span>{data.inputPhoneLabel}</span>
                    <input
                      placeholder={data.inputPhoneHolder}
                      type="text"
                      id="phone"
                      name="phone"
                      required
                    />
                  </label>
                </div>

                <label htmlFor="message">{data.inputMsgLabel}</label>
                <textarea
                  placeholder={data.inputMsgHolder}
                  id="message"
                  name="message"
                  required
                ></textarea>

                <button type="submit">{data.contactPageCta}</button>
              </form>
            )}
          </div>
        </div>
      </section>
        
      <Testimonials data={data} shop={shop} reviews={reviews} />
      <About data={data} shop={shop} />
      </main>
      <Footer shop={shop} data={data} />
    </div>

  );
};

export async function getStaticProps() {
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });

  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID, show: true }, order: { id: 'desc' } });
  const reviews = await fetchData('reviews', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      shop: shop[0],
      brand: brand[0],
      data: data[0],
      categories: categories,
      reviews: reviews,
    },
  };
}

export default Contact;