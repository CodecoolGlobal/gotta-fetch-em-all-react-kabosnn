export async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export function getLocations() {
  const URL = "https://pokeapi.co/api/v2/location/";

  return apiGet<Location[]>(URL);
}

//   export function getLocationDetails(serialNumber: string) {
//     const URL =
//       "https://jvvkjy8utk.execute-api.eu-central-1.amazonaws.com/tourist/api/countries/by-cca3";

//     return apiGet<LocationDetail>(`${URL}/${serialNumber}`);
//   }
