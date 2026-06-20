export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type ShipmentStatus = "WAITING" | "IN_TRANSIT" | "DELIVERED";

export type Shipment = {
  id: string;
  cargoName: string;
  weightTon: number;
  pickupAddress: string;
  deliveryAddress: string;
  pickupLocation: Coordinate;
  deliveryLocation: Coordinate;
};

export type RouteResponse = {
  coordinates: Coordinate[];
  distanceKm: number;
  etaMinutes: number;
};

export type ShipmentTrackingUpdate = {
  truckLocation: Coordinate;
  currentStep: number;
  progress: number;
  etaMinutes: number;
  status: ShipmentStatus;
};

export type ShipmentTrackingState = {
  routeCoordinates: Coordinate[];
  truckLocation: Coordinate;
  currentStep: number;
  status: ShipmentStatus;
  progress: number;
  distanceKm: number;
  etaMinutes: number;
  initialEtaMinutes: number;
  loadingRoute: boolean;
};
