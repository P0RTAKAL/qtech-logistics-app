import {
  Coordinate,
  ShipmentStatus,
  ShipmentTrackingUpdate,
} from "../types/logistics";

export const getShipmentTrackingUpdate = (
  routeCoordinates: Coordinate[],
  currentStep: number,
  initialEtaMinutes: number,
  jumpSize: number,
): ShipmentTrackingUpdate => {
  const nextStep = Math.min(
    currentStep + jumpSize,
    routeCoordinates.length - 1,
  );

  const isDelivered = nextStep === routeCoordinates.length - 1;

  const rawProgress = Math.round(
    (nextStep / (routeCoordinates.length - 1)) * 100,
  );

  const progress = Math.min(Math.round(rawProgress / 5) * 5, 100);

  const remainingProgress = 1 - nextStep / (routeCoordinates.length - 1);

  const status: ShipmentStatus = isDelivered ? "DELIVERED" : "IN_TRANSIT";

  return {
    truckLocation: routeCoordinates[nextStep],
    currentStep: nextStep,
    progress,
    etaMinutes: isDelivered
      ? 0
      : Math.max(Math.round(remainingProgress * initialEtaMinutes), 1),
    status,
  };
};
