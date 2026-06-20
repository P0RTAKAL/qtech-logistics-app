import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { RefObject } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Coordinate, Shipment } from "../types/logistics";

type Props = {
  mapRef: RefObject<MapView | null>;
  shipment: Shipment;
  truckLocation: Coordinate;
  routeCoordinates: Coordinate[];
};

export function ShipmentMap({
  mapRef,
  shipment,
  truckLocation,
  routeCoordinates,
}: Props) {
  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: 38.52,
        longitude: 27.28,
        latitudeDelta: 0.4,
        longitudeDelta: 0.4,
      }}
    >
      <Marker coordinate={shipment.pickupLocation} title="Yükleme Noktası">
        <View style={styles.pickupMarker}>
          <FontAwesome5 name="box" size={18} color="white" />
        </View>
      </Marker>

      <Marker coordinate={shipment.deliveryLocation} title="Teslimat Noktası">
        <View style={styles.deliveryMarker}>
          <MaterialIcons name="flag" size={24} color="white" />
        </View>
      </Marker>

      <Marker coordinate={truckLocation} title="Kamyon">
        <View style={styles.truckMarker}>
          <FontAwesome5 name="truck" size={22} color="white" />
        </View>
      </Marker>

      {routeCoordinates.length > 0 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={5}
          strokeColor="#2563eb"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  pickupMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#dc2626",
    alignItems: "center",
    justifyContent: "center",
  },
  truckMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
});
