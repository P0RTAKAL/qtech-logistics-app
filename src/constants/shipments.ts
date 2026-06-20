import { Shipment } from "../types/logistics";

export const SHIPMENTS: Shipment[] = [
  {
    id: "TR-2026-001",
    cargoName: "Elektronik Ürünler",
    weightTon: 12.4,
    pickupAddress: "İzmir Konak Depo",
    deliveryAddress: "Manisa OSB",
    pickupLocation: { latitude: 38.4237, longitude: 27.1428 },
    deliveryLocation: { latitude: 38.6191, longitude: 27.4289 },
  },
  {
    id: "TR-2026-002",
    cargoName: "Tekstil Ürünleri",
    weightTon: 18.7,
    pickupAddress: "İzmir Lojistik Merkezi",
    deliveryAddress: "İstanbul Tuzla Depo",
    pickupLocation: { latitude: 38.4237, longitude: 27.1428 },
    deliveryLocation: { latitude: 40.8176, longitude: 29.3096 },
  },
];
