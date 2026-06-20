import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Shipment,
  ShipmentStatus,
  ShipmentTrackingState,
} from "../types/logistics";

type Props = {
  shipments: Shipment[];
  selectedShipmentIndex: number;
  trackingByShipmentId: Record<string, ShipmentTrackingState>;
  onSelectShipment: (index: number) => void;
};

const statusLabelMap: Record<ShipmentStatus, string> = {
  WAITING: "Bekliyor",
  IN_TRANSIT: "Yolda",
  DELIVERED: "Teslim Edildi",
};

export function FleetOverview({
  shipments,
  selectedShipmentIndex,
  trackingByShipmentId,
  onSelectShipment,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Shipments</Text>

      <View style={styles.row}>
        {shipments.map((shipment, index) => {
          const tracking = trackingByShipmentId[shipment.id];
          const isSelected = selectedShipmentIndex === index;

          return (
            <Pressable
              key={shipment.id}
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => onSelectShipment(index)}
            >
              <View style={styles.cardHeader}>
                <FontAwesome5
                  name="truck"
                  size={13}
                  color={isSelected ? "#2563eb" : "#6b7280"}
                />

                <Text
                  style={[
                    styles.shipmentId,
                    isSelected && styles.selectedShipmentId,
                  ]}
                >
                  {shipment.id}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.progress}>%{tracking.progress}</Text>
                <Text style={styles.status}>
                  {statusLabelMap[tracking.status]}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 172,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 9,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCard: {
    backgroundColor: "#eff6ff",
    borderColor: "#2563eb",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shipmentId: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },
  selectedShipmentId: {
    color: "#111827",
  },
  cardFooter: {
    marginTop: 5,
  },
  progress: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2563eb",
  },
  status: {
    marginTop: 1,
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "600",
  },
});
