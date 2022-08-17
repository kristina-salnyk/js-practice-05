const FETCH_COUNTRIES_FIELDS = [
  'name',
  'capital',
  'population',
  'flags',
  'languages',
];

export function fetchCountries(name) {
  const searchParams = new URLSearchParams({
    fields: FETCH_COUNTRIES_FIELDS.join(','),
  });

  return fetch(
    `https://restcountries.com/v3.1/name/${name}?${searchParams}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
