export const endpointPaises = "https://restcountries.com/v3.1/all";

export const endPointSelected = (pais) => 
`https://restcountries.com/v3.1/name/${pais}`;

const endPointMap = "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static";

export const endPointCoordinates = (lon, lat) => {
    return `${endPointMap}/${lon},${lat},3,0/500x250?access_token=pk.eyJ1IjoiYXJ0bWV6OTkiLCJhIjoiY2xuZHF6ZzI3MDZsejJtb2d6ZmNodjZ3YSJ9.jONqzaXZIR12IOuj_blJ7g`
}