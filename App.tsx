import { useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { ShipmentMap } from "./src/components/ShipmentMap";
import { ShipmentStatusCard } from "./src/components/ShipmentStatusCard";
import { ShipmentHeaderCard } from "./src/components/ShipmentHeaderCard";
import { FleetOverview } from "./src/components/FleetOverview";
import { SHIPMENTS } from "./src/constants/shipments";
import { fetchRoute } from "./src/services/routeService";
import { getShipmentTrackingUpdate } from "./src/services/trackingService";
import {
  Shipment,
  ShipmentStatus,
  ShipmentTrackingState,
} from "./src/types/logistics";

const statusLabelMap: Record<ShipmentStatus, string> = {
  WAITING: "Bekliyor",
  IN_TRANSIT: "Yolda",
  DELIVERED: "Teslim Edildi",
};

const createInitialTrackingState = (
  shipment: Shipment,
): ShipmentTrackingState => ({
  routeCoordinates: [],
  truckLocation: shipment.pickupLocation,
  currentStep: 0,
  status: "WAITING",
  progress: 0,
  distanceKm: 0,
  etaMinutes: 0,
  initialEtaMinutes: 0,
  loadingRoute: false,
});

export default function App() {
  const mapRef = useRef<MapView>(null);

  const intervalRefs = useRef<
    Record<string, ReturnType<typeof setInterval> | null>
  >({});

  const [selectedShipmentIndex, setSelectedShipmentIndex] = useState(0);

  const [trackingByShipmentId, setTrackingByShipmentId] = useState<
    Record<string, ShipmentTrackingState>
  >(() =>
    SHIPMENTS.reduce<Record<string, ShipmentTrackingState>>((acc, shipment) => {
      acc[shipment.id] = createInitialTrackingState(shipment);
      return acc;
    }, {}),
  );

  const selectedShipment = SHIPMENTS[selectedShipmentIndex];
  const selectedTracking = trackingByShipmentId[selectedShipment.id];

  const statusLabel = useMemo(
    () => statusLabelMap[selectedTracking.status],
    [selectedTracking.status],
  );

  const clearTrackingInterval = (shipmentId: string) => {
    const interval = intervalRefs.current[shipmentId];

    if (interval) {
      clearInterval(interval);
      intervalRefs.current[shipmentId] = null;
    }
  };

  const clearAllTrackingIntervals = () => {
    Object.values(intervalRefs.current).forEach((interval) => {
      if (interval) {
        clearInterval(interval);
      }
    });

    intervalRefs.current = {};
  };

  const updateTrackingState = (
    shipmentId: string,
    updater: (state: ShipmentTrackingState) => ShipmentTrackingState,
  ) => {
    setTrackingByShipmentId((previous) => ({
      ...previous,
      [shipmentId]: updater(previous[shipmentId]),
    }));
  };

  const fitMapToRoute = (
    coordinates: ShipmentTrackingState["routeCoordinates"],
  ) => {
    if (coordinates.length === 0) return;

    setTimeout(() => {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 300,
          right: 50,
          bottom: 180,
          left: 50,
        },
        animated: true,
      });
    }, 300);
  };

  const loadRoute = async (shipment: Shipment) => {
    try {
      updateTrackingState(shipment.id, (state) => ({
        ...state,
        loadingRoute: true,
      }));

      const route = await fetchRoute(
        shipment.pickupLocation,
        shipment.deliveryLocation,
      );

      updateTrackingState(shipment.id, (state) => ({
        ...state,
        routeCoordinates: route.coordinates,
        distanceKm: route.distanceKm,
        etaMinutes: state.etaMinutes || route.etaMinutes,
        initialEtaMinutes: route.etaMinutes,
        loadingRoute: false,
      }));

      fitMapToRoute(route.coordinates);
    } catch {
      updateTrackingState(shipment.id, (state) => ({
        ...state,
        routeCoordinates: [shipment.pickupLocation, shipment.deliveryLocation],
        distanceKm: 0,
        etaMinutes: 0,
        initialEtaMinutes: 0,
        loadingRoute: false,
      }));
    }
  };

  const startTracking = () => {
    if (
      selectedTracking.status === "IN_TRANSIT" ||
      selectedTracking.routeCoordinates.length === 0 ||
      intervalRefs.current[selectedShipment.id]
    ) {
      return;
    }

    updateTrackingState(selectedShipment.id, (state) => ({
      ...state,
      status: "IN_TRANSIT",
    }));

    intervalRefs.current[selectedShipment.id] = setInterval(() => {
      setTrackingByShipmentId((previous) => {
        const currentState = previous[selectedShipment.id];

        const jumpSize = selectedShipment.id === "TR-2026-002" ? 40 : 8;

        const update = getShipmentTrackingUpdate(
          currentState.routeCoordinates,
          currentState.currentStep,
          currentState.initialEtaMinutes,
          jumpSize,
        );

        if (update.status === "DELIVERED") {
          clearTrackingInterval(selectedShipment.id);
        }

        return {
          ...previous,
          [selectedShipment.id]: {
            ...currentState,
            truckLocation: update.truckLocation,
            currentStep: update.currentStep,
            progress: update.progress,
            etaMinutes: update.etaMinutes,
            status: update.status,
          },
        };
      });
    }, 700);
  };

  const resetTracking = () => {
    clearTrackingInterval(selectedShipment.id);

    updateTrackingState(selectedShipment.id, (state) => ({
      ...state,
      truckLocation: selectedShipment.pickupLocation,
      currentStep: 0,
      status: "WAITING",
      progress: 0,
      etaMinutes: state.initialEtaMinutes,
    }));
  };

  const changeShipment = (index: number) => {
    const nextShipment = SHIPMENTS[index];
    const nextTracking = trackingByShipmentId[nextShipment.id];

    setSelectedShipmentIndex(index);

    if (nextTracking.routeCoordinates.length === 0) {
      loadRoute(nextShipment);
      return;
    }

    fitMapToRoute(nextTracking.routeCoordinates);
  };

  useEffect(() => {
    loadRoute(selectedShipment);

    return clearAllTrackingIntervals;
  }, []);

  return (
    <View style={styles.container}>
      <ShipmentMap
        mapRef={mapRef}
        shipment={selectedShipment}
        truckLocation={selectedTracking.truckLocation}
        routeCoordinates={selectedTracking.routeCoordinates}
      />

      <ShipmentHeaderCard
        shipment={selectedShipment}
        statusLabel={statusLabel}
      />

      <FleetOverview
        shipments={SHIPMENTS}
        selectedShipmentIndex={selectedShipmentIndex}
        trackingByShipmentId={trackingByShipmentId}
        onSelectShipment={changeShipment}
      />

      <ShipmentStatusCard
        loadingRoute={selectedTracking.loadingRoute}
        distanceKm={selectedTracking.distanceKm}
        etaMinutes={selectedTracking.etaMinutes}
        progress={selectedTracking.progress}
        status={selectedTracking.status}
        onStartTracking={startTracking}
        onResetTracking={resetTracking}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
