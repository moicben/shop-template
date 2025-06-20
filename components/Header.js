import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaRegTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import ReviewsBadge from './ReviewsBadge';

const Header = ({ name, domain, logo,categories, data, shop, reviews }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const cartDrawerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartDrawerRef.current && !cartDrawerRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const cartDrawer = document.querySelector('.cart-drawer');
    if (isCartOpen) {
      // Attendre que le composant soit monté pour ajouter la classe
      setTimeout(() => cartDrawer.classList.add('open'), 25);
    } else {
      //cartDrawer.classList.remove('open');
    }
  }, [isCartOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    const nav = document.querySelector('.header .nav ul');
    if (!isMenuOpen) {
      nav.classList.add('open');
    } else {
      nav.classList.remove('open');
    }
  };

  const getUserLocation = async () => {
    try {
      const responseIp = await fetch('https://api.ipify.org?format=json');
      const dataIp = await responseIp.json();

      const responseLocation = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_8RkVQJkGontjhO0cL3O0AZXCX17Y2&ipAddress=${dataIp.ip}`);
      const dataLocation = await responseLocation.json();
      
      return dataLocation;

    } catch (error) {
      console.error('Error fetching IP:', error);
      return null;
    }
  };

  const toggleCart = async () => {
    setIsCartOpen(!isCartOpen);
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  };

  useEffect(() => {
    // Applique display none à : #__EAAPS_PORTAL>div>div>div.Window__Container-sc-251c030e-0.iKEatB a
    const element = document.querySelector('#__EAAPS_PORTAL>div>div>div.Window__Container-sc-251c030e-0.iKEatB a');
    if (element) {
      element.style.display = 'none';
    }
  }, []);

  const handleCheckout = async () => {
    
    router.push('/checkout');
  };

  

  return (
    <>
    
      {/* <script src="https://static.elfsight.com/platform/platform.js" async></script>
      <div class="elfsight-app-ff817ebe-8d94-42a7-a8d9-ace1c29d4f7a" data-elfsight-app-lazy></div>
       */}

        <header className={`header ${shop.id === 3 && 'wedinery'}`}>
        <div className='wrapper'>
          <a className={`logo-header ${shop.id === 3 && 'wedinery'}`} href="/"><img src={logo} alt="Logo"/></a>
          <nav className="nav">
            <ul>
              
              {shop.id === 3 && (
                <>
                <li><a className='' href="/bestsellers/eliminateur-peluches">Éliminateur de peluches</a></li>
                <li><a className='' href="/bestsellers/defroisseur-protatif">Défroisseur portatif</a></li>
                <li> <a className='' href="/bestsellers/nettoyeur-a-vapeur">nettoyeur à vapeur</a></li>
                </>
              )}
              
              {shop.id !== 3 && (
                <>
                  {categories && categories
                .sort((a, b) => a.order - b.order)
                .map((category, index) => (
                <li key={index}>
                  <a href={`/${category.slug}`}>{category.name}</a>
                </li>
                    ))}
                </>
              )}

              <li className="dropdown brand">
          <a className='color-primary' href="#"><i className='fas fa-info border-primary'></i>A propos / La marque</a>
          <ul className="dropdown-menu">
            
            {/* <li><a href="/about">{data.headerLink1}</a></li> */}
            <li>  
              <a
                href="#"
                onClick={(e) => {
                        e.preventDefault(); // Empêche le comportement par défaut du lien
                        const badgeImage = document.querySelector("section.badge-container > img");
                        if (badgeImage) {
                          badgeImage.click(); // Simule un clic sur l'image
                        }
                      }}
                    >
                      {data.headerLink3}
                    </a>
                  </li>
                  
                  <li><a href="/blog">{data.headerLink2}</a></li>
                  
                  <li><a href="/contact">{data.headerLink4}</a></li>
                  <li><a href="/help">{data.headerLink5}</a></li>
                </ul>
              </li>
            </ul>
          </nav>
          <div className="cart-container" onClick={toggleCart}>
            <FaShoppingCart className="cart-icon" />
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </div>
          <span className="burger-icon" onClick={toggleMenu}>{isMenuOpen ? <FaTimes /> : <FaBars />} </span>
        </div>
      </header>
      {isCartOpen && (
        <div className="cart-drawer" ref={cartDrawerRef}>
          <h2>{data.cartLabel}</h2>
          {cart.length === 0 ? (
            <p>{data.cartEmpty}</p>
          ) : (
          <ul>            {cart.map((item, index) => (
              <li key={index}>
                <img src={item.selectedOption?.img || item.images[0]} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  {item.selectedOption && (
                    <p className="selected-option">{item.selectedOption.title}</p>
                  )}
                  <p>{item.price.toLocaleString(shop.language, { minimumFractionDigits: 2 })} {shop.currency}</p>
                  <div className="quantity-selector">
                    <button onClick={() => handleQuantityChange(index, item.quantity > 1 ? item.quantity - 1 : 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</button>
                  </div>
                  <button className="delete" onClick={() => handleRemoveFromCart(index)}>
                    <FaRegTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="total">
            <h4>{data.cartTotal}</h4>
            <p>{`${cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString(shop.language, { minimumFractionDigits: 2 })} ${shop.currency}`}</p>
        </div>
        <button className="close" onClick={toggleCart}>+</button>
        <button 
          className="checkout" 
          onClick={handleCheckout} 
          disabled={cart.length === 0} // Désactive le bouton si le panier est vide
        >
          {data.cartCta}
        </button>
      </div>
        )}

      <section className="badge-container">
          <ReviewsBadge domain={shop.domain} logo={logo} count={data.reviewCount} reviews={reviews} reviewCtaHead={data.reviewCtaHead}/>
      </section>
    </>
  );
};

export default Header;