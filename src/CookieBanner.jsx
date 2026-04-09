import React, { useState, useEffect } from 'react';
import './Banner.css'; // Importez votre CSS ici

// --- CONSTANTES & CONFIGURATION ---
const BANNER_DOMAIN = 'monnouveaum2.com'; // À adapter ou passer en props
const POLICIES_URL = 'https://monnouveaum2.com/politique-de-confidentialite/';
const LOGO_URL = 'https://monnouveaum2.com/wp-content/uploads/2022/05/Logo-Mon-Nouveau-m2.svg';

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
    document.cookie = `consent_mode=${consent};expires=${expires.toUTCString()};domain=.${BANNER_DOMAIN};path=/`;
    
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
    <div className="cmpbanner">
      <div className="cmpmask">
        <div className="cmpcontainerauto">
          
          {/* VUE 1 : BANNIÈRE PRINCIPALE */}
          {view === 'banner' && (
            <div id="message" style={{ padding: '4%', display: 'block' }}>
              <div className="cmpwrapper1">
                <div className="cmplogo" style={{ gridColumn: '1/3', gridRow: '1' }}>
                  <img src={LOGO_URL} alt="Logo" style={{ maxWidth: '120px' }} />
                </div>
                <span className="cmptitle" style={{ gridColumn: '2/3', gridRow: '1' }}>
                  NOUS RESPECTONS VOTRE VIE PRIVEE
                </span>
                <button onClick={handleDenyAll} className="cmpbutton3">
                  continuer sans accepter
                </button>
              </div>
              <span className="cmpdescription">
                Mon Nouveau mètre carré utilise des cookies pour personnaliser le contenu et vous offrir une expérience sur mesure. Vous pouvez gérer vos préférences et en savoir plus en cliquant sur "Paramètres des cookies" et à tout moment dans notre <a href={POLICIES_URL} className="cmplink">Politique de confidentialité.</a>
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridGap: '30px', alignItems: 'center', marginTop:'20px' }}>
                <button className="cmpbutton2" onClick={handleAcceptAll}>ACCEPTER</button>
                <button className="cmpfavoritestyled2" onClick={() => setView('preferences')}>PERSONNALISER MES CHOIX</button>
              </div>
            </div>
          )}

          {/* VUE 2 : CENTRE DE PRÉFÉRENCES */}
          {view === 'preferences' && (
            <div id="preference_center" style={{ padding: '4%' }}>
              <div className="cmpwrapper2">
                <div className="cmplogo">
                  <img src={LOGO_URL} alt="Logo" style={{ maxHeight: '100px' }} />
                </div>
                <span className="cmptitleprefcenter">Centre de préférences</span>
              </div>
              
              <span className="cmpdescription_center">
                Lorsque vous consultez un site Web, des données peuvent être stockées...
              </span>

              <div className="cmpcategory">
                {/* Catégorie 1 : Indispensable */}
                <div className="cmpcategory_1">
                  <span className="cmpcat_title">Cookies strictement nécessaires :</span>
                  <span className="cmpcat_description">Ces cookies sont absolument nécessaires au bon fonctionnement de notre site et ne peuvent être désactivés.</span>
                  <div className="toggle_validation">
                    <label className="switch">
                      <input type="checkbox" checked disabled />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>

                {/* Catégorie 2 : Analytics */}
                <div className={toggles[2] ? "cmpcategory_1" : "cmpcategory_2"}>
                  <span className="cmpcat_title">Cookies de mesure de la performance:</span>
                  <span className="cmpcat_description">Ces cookies nous permettent de mesurer l'activité des utilisateurs sur notre site.</span>
                  <div className="toggle_validation">
                    <label className="switch">
                      <input type="checkbox" checked={toggles[2]} onChange={() => handleToggle(2)} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>

                {/* Catégorie 3 : Personnalisation */}
                <div className={toggles[3] ? "cmpcategory_1" : "cmpcategory_2"}>
                  <span className="cmpcat_title">Cookies de fonctionnalité:</span>
                  <span className="cmpcat_description">Ces cookies nous permettent de mettre en oeuvre des fonctionnalités de personnalisation.</span>
                  <div className="toggle_validation">
                    <label className="switch">
                      <input type="checkbox" checked={toggles[3]} onChange={() => handleToggle(3)} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>

                {/* Catégorie 4 : Publicité */}
                <div className={toggles[4] ? "cmpcategory_1" : "cmpcategory_2"}>
                  <span className="cmpcat_title">Cookies de publicité ciblée:</span>
                  <span className="cmpcat_description">Ces cookies peuvent être déposés par nos partenaires publicitaires.</span>
                  <div className="toggle_validation">
                    <label className="switch">
                      <input type="checkbox" checked={toggles[4]} onChange={() => handleToggle(4)} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <button className="cmpbutton1" onClick={handleSavePreferences}>SAUVEGARDER MA SELECTION</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
