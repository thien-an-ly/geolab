/**
 * Utility functions for formatting property keys and values
 * for display in the UI.
 */

/**
 * Check if a property key should be excluded from display.
 * Filters out technical/internal fields that aren't useful to users.
 *
 * @example
 * isKeyExcluded("OBJECTID") => true
 * isKeyExcluded("Season") => false
 */
export function isKeyExcluded(key: string): boolean {
  const excludedKeys = [
    "Season",
    "OBJECTID",
    "OBJECTID1",
    "FID",
    "id",
    "fid",
    "Id",
    "gridcode",
    "Shape_Length",
    "SHAPE_Length",
    "Shape_Area",
    "SHAPE_Area",
    "change_type",
  ];
  return excludedKeys.includes(key);
}

/**
 * Format property keys to be more readable.
 * Converts camelCase and snake_case to Title Case.
 *
 * @example
 * formatKey("carbonLoss") => "Carbon Loss"
 * formatKey("Area (ha)") => "Area (Ha)"
 * formatKey("flood_signal") => "Flood Signal"
 */
export function formatKey(key: string): string {
  switch (key) {
    case "Ha":
    case "ha":
    case "area_ha":
    case "Area":
      return "Area (Ha)";
    case "ha_change":
      return "Area of change (Ha)";
  }

  return key
    .replace(/([A-Z])/g, " $1") // Add space before capitals
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/-/g, " ") // Replace dashes with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    .trim();
}

/**
 * Format property values based on their type.
 * Handles null/undefined, numbers, booleans, objects, and strings.
 *
 * @example
 * formatValue(null) => "N/A"
 * formatValue(123.456) => "123.46"
 * formatValue(true) => "Yes"
 * formatValue("text") => "text"
 */
export function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "N/A";
  }
  if (typeof value === "number") {
    // Format numbers with appropriate decimal places
    return value % 1 === 0 ? value.toString() : value.toFixed(2);
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
