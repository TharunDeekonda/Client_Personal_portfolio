import { translations } from './translations.js';

let currentLang = 'en';

export function initI18n() {
  const langBtn = document.getElementById('langBtn');

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'te' : 'en';
      applyTranslations(currentLang);
    });
  }
}

function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;

  // Toggle body class for font switching
  if (lang === 'te') {
    document.body.classList.add('lang-te');
  } else {
    document.body.classList.remove('lang-te');
  }

  // Update elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // Update specific form option labels if they use data-i18n
  const options = document.querySelectorAll('option[data-i18n]');
  options.forEach(opt => {
    const key = opt.getAttribute('data-i18n');
    if (dict[key]) {
      opt.textContent = dict[key];
    }
  });
}
