export type FacilityInput = {
  icon: string;
  label: string;
};

export function parseLineList(raw: string) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseFacilities(raw: string): FacilityInput[] {
  const lines = parseLineList(raw);
  return lines.map((line) => {
    const [icon, ...labelParts] = line.split("|").map((part) => part.trim());
    return {
      icon: icon || "check_circle",
      label: labelParts.join("|") || icon || "Fasilitas",
    };
  });
}
