// Country name translations to German
export const countryNamesDE: { [key: string]: string } = {
  // German-speaking countries
  'Austria': 'Österreich',
  'Germany': 'Deutschland',
  'Switzerland': 'Schweiz',
  'Liechtenstein': 'Liechtenstein',

  // European Union
  'Belgium': 'Belgien',
  'Bulgaria': 'Bulgarien',
  'Croatia': 'Kroatien',
  'Cyprus': 'Zypern',
  'Czech Republic': 'Tschechien',
  'Denmark': 'Dänemark',
  'Estonia': 'Estland',
  'Finland': 'Finnland',
  'France': 'Frankreich',
  'Greece': 'Griechenland',
  'Hungary': 'Ungarn',
  'Ireland': 'Irland',
  'Italy': 'Italien',
  'Latvia': 'Lettland',
  'Lithuania': 'Litauen',
  'Luxembourg': 'Luxemburg',
  'Malta': 'Malta',
  'Netherlands': 'Niederlande',
  'Poland': 'Polen',
  'Portugal': 'Portugal',
  'Romania': 'Rumänien',
  'Slovakia': 'Slowakei',
  'Slovenia': 'Slowenien',
  'Spain': 'Spanien',
  'Sweden': 'Schweden',

  // Other European countries
  'United Kingdom': 'Vereinigtes Königreich',
  'Norway': 'Norwegen',
  'Iceland': 'Island',
  'Turkey': 'Türkei',
  'Russia': 'Russland',
  'Ukraine': 'Ukraine',
  'Serbia': 'Serbien',
  'Bosnia and Herzegovina': 'Bosnien und Herzegowina',
  'Albania': 'Albanien',
  'North Macedonia': 'Nordmazedonien',
  'Montenegro': 'Montenegro',
  'Kosovo': 'Kosovo',

  // Americas
  'United States': 'Vereinigte Staaten',
  'Canada': 'Kanada',
  'Mexico': 'Mexiko',
  'Brazil': 'Brasilien',
  'Argentina': 'Argentinien',
  'Chile': 'Chile',
  'Colombia': 'Kolumbien',
  'Peru': 'Peru',
  'Venezuela': 'Venezuela',

  // Asia
  'China': 'China',
  'Japan': 'Japan',
  'India': 'Indien',
  'South Korea': 'Südkorea',
  'Thailand': 'Thailand',
  'Vietnam': 'Vietnam',
  'Indonesia': 'Indonesien',
  'Malaysia': 'Malaysia',
  'Singapore': 'Singapur',
  'Philippines': 'Philippinen',
  'Pakistan': 'Pakistan',
  'Bangladesh': 'Bangladesch',
  'Israel': 'Israel',
  'Saudi Arabia': 'Saudi-Arabien',
  'United Arab Emirates': 'Vereinigte Arabische Emirate',

  // Africa
  'South Africa': 'Südafrika',
  'Egypt': 'Ägypten',
  'Nigeria': 'Nigeria',
  'Kenya': 'Kenia',
  'Morocco': 'Marokko',
  'Algeria': 'Algerien',
  'Tunisia': 'Tunesien',

  // Oceania
  'Australia': 'Australien',
  'New Zealand': 'Neuseeland',
}

/**
 * Translate country name to German
 */
export function translateCountryName(countryName: string): string {
  return countryNamesDE[countryName] || countryName
}
