import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ShipmentStatus } from "../types/logistics";
import { formatDuration } from "../utils/formatDuration";

type Props = {
  loadingRoute: boolean;
  distanceKm: number;
  etaMinutes: number;
  progress: number;
  status: ShipmentStatus;
  onStartTracking: () => void;
  onResetTracking: () => void;
};

export function ShipmentStatusCard({
  loadingRoute,
  distanceKm,
  etaMinutes,
  progress,
  status,
  onStartTracking,
  onResetTracking,
}: Props) {
  const isInTransit = status === "IN_TRANSIT";
  const isDelivered = status === "DELIVERED";
  return (
    <View style={styles.bottomCard}>
      {loadingRoute ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Rota hazırlanıyor...</Text>
        </View>
      ) : (
        <>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>Mesafe</Text>
              <Text style={styles.value}>{distanceKm || "-"} km</Text>
            </View>

            <View>
              <Text style={styles.label}>ETA</Text>
              <Text style={styles.value}>
                {status === "DELIVERED"
                  ? "Tamamlandı"
                  : formatDuration(etaMinutes)}
              </Text>
            </View>

            <View>
              <Text style={styles.label}>İlerleme</Text>
              <Text style={styles.value}>%{progress}</Text>
            </View>
          </View>

          <Pressable
            disabled={isInTransit}
            style={[
              styles.button,
              isInTransit && styles.disabledButton,
              isDelivered && styles.secondaryButton,
            ]}
            onPress={isDelivered ? onResetTracking : onStartTracking}
          >
            <Text style={styles.buttonText}>
              {isDelivered
                ? "Seferi Sıfırla"
                : isInTransit
                  ? "Sefer Devam Ediyor"
                  : "Seferi Başlat"}
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 22,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: "#777",
  },
  value: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#111827",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 10,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
});
