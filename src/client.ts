export async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export function getLocations() {
  const URL = "https://pokeapi.co/api/v2/location/";

  return apiGet<Location[]>(URL);
}
