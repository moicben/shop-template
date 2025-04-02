import React from 'react';
import Head from '../components/Head';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { fetchData } from 'lib/supabase';


const PolitiqueDesRetours = ({shop, brand}) => {
  return (

    <div className="container">
      <Head name={shop.name} domain={shop.domain}
            favicon={brand.favicon} graph={brand.graph}
            colorPrimary={brand.colorPrimary} colorSecondary={brand.colorSecondary} colorBlack={brand.colorBlack} colorGrey={brand.colorGrey} bgMain={brand.bgMain} bgLight={brand.bgLight} bgDark={brand.bgDark} radiusBig={brand.radiusBig} radiusMedium={brand.radiusMedium} font={brand.font} 
            title={`Politique de retours - ${shop.name}`}
      />
      
      <main >
        <Header title={shop.name} name={shop.name} domain={shop.domain} logo={brand.logo} />

    
      <section  className='legal'> 
        <h1>Politique des Retours</h1>
        <p>
          Nous voulons que vous soyez entièrement satisfait de votre achat. Si pour une raison quelconque vous n'êtes pas satisfait, nous acceptons les retours sous certaines conditions.
        </p>
      
        <section>
          <h2>1. Conditions de retour</h2>
          <p>
            Les articles peuvent être retournés s'ils respectent les conditions suivantes :
          </p>
          <ul>
            <li>Les articles doivent être retournés dans les 60 jours suivant la réception.</li>
            <li>Les articles doivent être dans leur état d'origine, non utilisés et non endommagés.</li>
            <li>Les articles doivent être retournés avec tous les accessoires et emballages d'origine.</li>
          </ul>
        </section>
        <section>
          <h2>2. Processus de retour</h2>
          <p>
            Pour initier un retour, veuillez suivre les étapes suivantes :
          </p>
          <ul>
            <li>Contactez notre service client à l'adresse suivante : support@{shop.domain}.</li>
            <li>Indiquez votre numéro de commande et la raison du retour.</li>
            <li>Suivez les instructions fournies par notre service client pour retourner l'article.</li>
          </ul>
        </section>
        <section>
          <h2>3. Remboursements</h2>
          <p>
            Une fois que nous aurons reçu et inspecté l'article retourné, nous vous informerons de l'approbation ou du rejet de votre remboursement. Si votre retour est approuvé, un remboursement sera effectué sur votre méthode de paiement d'origine dans un délai de quelques jours.
          </p>
        </section>
        <section>
          <h2>4. Échanges</h2>
          <p>
            Si vous souhaitez échanger un article, veuillez suivre le processus de retour et passer une nouvelle commande pour l'article souhaité.
          </p>
        </section>
        <section>
          <h2>5. Articles non retournables</h2>
          <p>
            Certains articles ne peuvent pas être retournés, tels que :
          </p>
          <ul>
            <li>Cartes cadeaux.</li>
            <li>Articles en solde.</li>
            <li>Articles personnalisés.</li>
          </ul>
        </section>
        <section>
          <h2>6. Contact</h2>
          <p>
            Pour toute question concernant cette politique de retour, vous pouvez nous contacter à l'adresse suivante : support@{shop.domain}.
          </p>
        </section>
      </section>
      </main>
      <Footer shop={shop} />
    </div>
  );
};

export default PolitiqueDesRetours;


export async function getStaticProps() {
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      shop: shop[0],
      brand: brand[0],
    },
  };
}
