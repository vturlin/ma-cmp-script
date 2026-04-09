import React, { useState, useEffect } from 'react';
import './Banner.css'; 

// --- RECUPERATION DYNAMIQUE DES VARIABLES ---
// On lit l'objet window.cmpSettings, ou on crée un objet vide s'il n'existe pas
const settings = window.cmpSettings || {};

const DOMAIN = settings.domain || window.location.hostname; // Par défaut, prend le domaine actuel
const SITE_NAME = settings.siteName || 'notre site';
const LOGO_URL = settings.logo || 'https://via.placeholder.com/150x50?text=Logo';
const BG_IMAGE_URL = settings.bgImage || 'https://via.placeholder.com/600x800?text=Image+de+fond';
const PRIMARY_COLOR = settings.primaryColor || '#000000'; // Noir par défaut
const POLICIES_URL = '/politique-de-confidentialite/';

// --- LE COMPOSANT REACT ---
const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState('banner'); 
  const [toggles, setToggles] = useState({ 2: false, 3: false, 4: false });

// --- FONCTIONS UTILITAIRES (GTM & COOKIES) ---
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }

const GTM = {
  setDefault: () => {
    gtag('consent', 'default', {
      'ad_storage': "denied", 'analytics_storage': "denied",
      'functionality_storage': "denied", 'personalization_storage': "denied",
      'security_storage': "granted", 'ad_user_data': "denied",
      'ad_personalization': "denied", 'wait_for_update': 500
    });
  },
  updateConsent: (consentMode) => {
    const hasAds = consentMode.includes('4');
    const hasPerso = consentMode.includes('3');
    const hasAnalytics = consentMode.includes('2');

    gtag('consent', 'update', {
      'ad_storage': hasAds ? 'granted' : 'denied',
      'ad_personalization': hasAds ? 'granted' : 'denied',
      'ad_user_data': hasAds ? 'granted' : 'denied',
      'functionality_storage': hasPerso ? "granted" : "denied",
      'personalization_storage': hasPerso ? "granted" : "denied",
      'analytics_storage': hasAnalytics ? 'granted' : 'denied',
      'security_storage': "granted"
    });

    window.dataLayer.push({
      'event': 'consent_mode_updated',
      'consent_mode': consentMode
    });
  }
};

const Cookies = {
  get: (cname) => {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return 'absent';
  },
  set: (consent) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 365);
    // On utilise la variable dynamique DOMAIN ici
    document.cookie = `consent_mode=${consent};expires=${expires.toUTCString()};domain=.${DOMAIN};path=/`;
  }
};
    
    // Cookie Record ID
    const id = Date.now() + '.' + Math.random().toString(36).substr(2, 3);
    document.cookie = `consent_record=${id};expires=${expires.toUTCString()};domain=.${BANNER_DOMAIN};path=/`;
  }
};


// --- LE COMPOSANT REACT ---
const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState('banner'); // 'banner' ou 'preferences'
  
  // État des cases à cocher (Cat 1 est toujours vraie)
  const [toggles, setToggles] = useState({
    2: false, // Performance / Analytics
    3: false, // Fonctionnalités / Perso
    4: false  // Publicité
  });

  // INITIALISATION
  useEffect(() => {
    GTM.setDefault();
    const consentMode = Cookies.get('consent_mode');
    const consentRecord = Cookies.get('consent_record');

    if (consentMode === 'absent' || consentMode === 'empty' || consentRecord === 'absent') {
      setIsVisible(true);
    } else {
      // Si on a déjà le consentement, on met à jour GTM sans afficher la bannière
      GTM.updateConsent(consentMode);
    }
  }, []);

  // GESTIONNAIRES D'ACTIONS
  const handleAcceptAll = () => {
    const fullConsent = '1,2,3,4';
    Cookies.set(fullConsent);
    GTM.updateConsent(fullConsent);
    setIsVisible(false);
  };

  const handleDenyAll = () => {
    const minimalConsent = '1';
    Cookies.set(minimalConsent);
    GTM.updateConsent(minimalConsent);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    const selectedCats = ['1']; // Toujours inclure la catégorie 1 (essentielle)
    if (toggles[2]) selectedCats.push('2');
    if (toggles[3]) selectedCats.push('3');
    if (toggles[4]) selectedCats.push('4');
    
    const customConsent = selectedCats.join(',');
    Cookies.set(customConsent);
    GTM.updateConsent(customConsent);
    setIsVisible(false);
  };

  const handleToggle = (id) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // SI LA BANNIÈRE EST CACHÉE, ON NE REND RIEN
  if (!isVisible) return null;

  return (
    // L'astuce magique : On injecte la couleur dynamique comme variable CSS personnalisée
    <div className="cmp-modal-overlay" style={{ '--cmp-color': PRIMARY_COLOR }}>
      <div className="cmp-modal-container">
        
        {/* VUE BANNIÈRE */}
        {view === 'banner' && (
          <div className="cmp-modal-content cmp-view-banner">
            
            {/* Colonne Image */}
            <div className="cmp-image-column" style={{ backgroundImage: `url(${BG_IMAGE_URL})` }}>
            </div>

            {/* Colonne Texte */}
            <div className="cmp-text-column">
              <div className="cmp-header-bar">
                <div className="cmp-logo">
                  <img src={LOGO_URL} alt={`Logo ${SITE_NAME}`} />
                </div>
                <button onClick={handleDenyAll} className="cmp-link-dismiss">
                  Continuer sans accepter &rarr;
                </button>
              </div>

              <div className="cmp-main-text">
                <h1 className="cmp-title">Tout d'abord bienvenue !</h1>
                <p className="cmp-intro">
                  Bienvenue sur {SITE_NAME} ! Voici quelques bonnes raisons de dire « oui » à nos cookies pour une expérience personnalisée :
                </p>
                <div className="cmp-reason-list">
                  <div className="cmp-reason-item">
                    <p><strong>Personnalisation :</strong> Proposer du contenu adapté à vos centres d'intérêt.</p>
                  </div>
                  <div className="cmp-reason-item">
                    <p><strong>Gain de temps :</strong> Inutile de retaper vos informations à chaque visite.</p>
                  </div>
                </div>
              </div>

              <div className="cmp-footer-actions">
                <button className="cmp-link-preferences" onClick={() => setView('preferences')}>
                  Paramétrer
                </button>
                {/* Ce bouton utilisera la couleur définie dans window.cmpSettings */}
                <button className="cmp-button-accept" onClick={handleAcceptAll} style={{ backgroundColor: 'var(--cmp-color)', borderColor: 'var(--cmp-color)' }}>
                  Accepter et continuer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VUE PRÉFÉRENCES */}
        {view === 'preferences' && (
           <div className="cmp-modal-content cmp-view-preferences">
              {/* Le contenu de votre centre de préférences... */}
           </div>
        )}

      </div>
    </div>
  );
};

export default CookieBanner;
