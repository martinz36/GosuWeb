const dictionaries = {
  es: () => import('./dictionaries/es.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export type Locale = 'es' | 'en';

export const getDictionary = async (locale: Locale) => {
  if (locale !== 'es' && locale !== 'en') {
    return dictionaries.es();
  }
  return dictionaries[locale]();
};
