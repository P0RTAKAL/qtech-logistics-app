import { Coordinate, RouteResponse } from "../types/logistics";

const getRouteUrl = (pickup: Coordinate, delivery: Coordinate) => {
  return `https://router.project-osrm.org/route/v1/driving/${pickup.longitude},${pickup.latitude};${delivery.longitude},${delivery.latitude}?overview=full&geometries=geojson`;
};

export const fetchRoute = async (
  pickup: Coordinate,
  delivery: Coordinate,
): Promise<RouteResponse> => {
  const response = await fetch(getRouteUrl(pickup, delivery));

  if (!response.ok) {
    throw new Error("Route request failed");
  }

  const data = await response.json();
  const route = data.routes?.[0];

  if (!route) {
    throw new Error("Route not found");
  }

  const coordinates: Coordinate[] = route.geometry.coordinates.map(
    ([longitude, latitude]: [number, number]) => ({
      latitude,
      longitude,
    }),
  );

  return {
    coordinates,
    distanceKm: Math.round((route.distance / 1000) * 10) / 10,
    etaMinutes: Math.round(route.duration / 60),
  };
};
