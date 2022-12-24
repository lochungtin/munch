export const localeCapitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export const allLocaleCapitalise = (text) => text.split(' ').map(localeCapitalise).join(' ');
