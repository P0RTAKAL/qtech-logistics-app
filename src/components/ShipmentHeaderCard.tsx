import { StyleSheet, Text, View } from "react-native";
import { Shipment } from "../types/logistics";

type Props = {
  shipment: Shipment;
  statusLabel: string;
};

export function ShipmentHeaderCard({ shipment, statusLabel }: Props) {
  return (
    <View style={styles.topCard}>
      <Text style={styles.title}>Shipment #{shipment.id}</Text>

      <Text style={styles.subtitle}>
        {shipment.cargoName} · {shipment.weightTon} Ton
      </Text>

      <Text style={styles.route} numberOfLines={1}>
        {shipment.pickupAddress} → {shipment.deliveryAddress}
      </Text>

      <Text style={styles.status}>Durum: {statusLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topCard: {
    position: "absolute",
    top: 56,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 13,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "#444",
  },
  route: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
  },
  status: {
    marginTop: 8,
    fontSize: 13,
    color: "#2563eb",
    fontWeight: "700",
  },
});
