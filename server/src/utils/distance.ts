/**
 * Calculates distance between two coordinates in kilometers using Haversine formula.
 * Extensible data model for future Google Maps Distance Matrix integration.
 */
export function calculateDistanceKm(
  lat1?: number | null,
  lon1?: number | null,
  lat2?: number | null,
  lon2?: number | null
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) {
    // Return a mock realistic distance between 3.5 km and 14.2 km for MVP demonstration
    return Math.round((4.2 + (Math.abs((lat1 || 12.97) + (lon1 || 77.59)) % 10)) * 10) / 10;
  }

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}
