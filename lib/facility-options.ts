export interface FacilityOption {
  icon: string;
  label: string;
}

export const FACILITY_OPTIONS: FacilityOption[] = [
  { icon: "ac_unit", label: "AC" },
  { icon: "wifi", label: "WiFi" },
  { icon: "event_seat", label: "Kursi Reclining" },
  { icon: "smart_display", label: "TV / Monitor" },
  { icon: "mic", label: "Karaoke" },
  { icon: "volume_up", label: "Sound System" },
  { icon: "power", label: "USB Charger" },
  { icon: "snowshoeing", label: "Bantal & Selimut" },
  { icon: "local_drink", label: "Dispenser / Air Minum" },
  { icon: "luggage", label: "Bagasi Luas" },
  { icon: "camera_rear", label: "Kamera Mundur" },
  { icon: "gps_fixed", label: "GPS Tracker" },
];

export function toFacilityValue(option: FacilityOption) {
  return `${option.icon} | ${option.label}`;
}
