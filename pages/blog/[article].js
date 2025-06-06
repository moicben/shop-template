import React from 'react';
import { useRouter } from 'next/router';
import Head from '../../components/Head';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Categories from '../../components/Categories';

import { fetchData } from 'lib/supabase.mjs';

const Article = ({ shop, data, brand, article, categories, reviews, products }) => {
  const router = useRouter();
  const { article: articleId } = router.query;

  if (!article) {
    return <p>Article non trouvé</p>;
  }

  const handleViewAll = () => {
    router.push('/blog');
  }

  return (
    <div className="container">
      <Head
        name={shop.name}
        domain={shop.domain}
        favicon={brand.favicon}
        graph={brand.graph}
        colorPrimary={brand.colorPrimary}
        colorSecondary={brand.colorSecondary}
        colorBlack={brand.colorBlack}
        colorGrey={brand.colorGrey}
        bgMain={brand.bgMain}
        bgLight={brand.bgLight}
        bgDark={brand.bgDark}
        radiusBig={brand.radiusBig}
        radiusMedium={brand.radiusMedium}
        font={brand.font}
        title={`${article.title} - ${shop.name}`}
        description={article.excerpt}
      />

      <main>
        <Header logo={brand.logo} categories={categories} data={data} shop={shop} reviews={reviews} />
        <section className="article" id="article">
          <div className="wrapper">
            <div className="article-content">
              <img src={article.thumbnail} alt={article.title} />
              <h1>{article.title}</h1>
              <h3 className="desc">{article.excerpt}</h3>
              <div className="content" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </div>
          <button onClick={handleViewAll}>{data.blogViewAll}</button>
        </section>
      </main>
      <Categories categories={categories} title="Découvrez nos équipements" data={data} products={products}/>
      <Footer shop={shop} data={data} />
    </div>
  );
};

export async function getStaticPaths() {
  // Récupération des posts depuis la table "posts"
  const posts = await fetchData('posts', { match: { shop_id: process.env.SHOP_ID } });

  if (!posts || posts.length === 0) {
    console.error("Erreur : aucun post trouvé dans la table posts.");
    return { paths: [], fallback: false };
  }

  const paths = posts.map(post => ({
    params: { article: post.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // Récupérer l'article correspondant dans la table "posts"
  const posts = await fetchData('posts', { match: { shop_id: process.env.SHOP_ID } });
  const article = posts.find(post => post.slug === params.article);

  if (!article) {
    return { notFound: true };
  }

  // Récupérer les autres données pour la page
  const data = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });
  const brand = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID, show: true }, order: { id: 'desc' } });
  const reviews = await fetchData('reviews', { match: { shop_id: process.env.SHOP_ID } });
  const products = await fetchData('products', { match: { shop_id: process.env.SHOP_ID } });

  return {
    props: {
      data: data[0],
      shop: shop[0],
      brand: brand[0],
      article,
      categories,
      reviews,
      products,
    },
  };
}

export default Article;