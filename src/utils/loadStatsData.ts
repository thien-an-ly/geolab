/**
 * Utility functions for loading and combining statistical CSV data
 * from public/stats/ directory using config-driven approach
 */

import { STAT_SOURCES } from "../config/statSources";

/**
 * Parse CSV text to array of objects with dynamic typing
 */
function parseCSV(csvText: string): Record<string, string | number>[] {
  const lines = csvText.trim().split("\n");
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string | number> = {};

    headers.forEach((header, index) => {
      const value = values[index];
      // Try to parse as number, keep as string if it fails
      const numValue = parseFloat(value);
      obj[header] = isNaN(numValue) ? value : numValue;
    });

    return obj;
  });
}

/**
 * Load all statistical data and combine by year with year range filtering
 */
export async function loadStatsData() {
  try {
    // Load all CSV files from config
    const responses = await Promise.all(
      STAT_SOURCES.map((source) => fetch(source.path))
    );

    const texts = await Promise.all(responses.map((r) => r.text()));

    // Parse all datasets
    const datasets = texts.map((text, i) => ({
      data: parseCSV(text),
      prefix: STAT_SOURCES[i].prefix,
    }));

    // Get all unique years
    const allYears = new Set<number>();
    datasets.forEach((ds) => {
      ds.data.forEach((row) => {
        if (typeof row.year === "number") {
          allYears.add(row.year);
        }
      });
    });

    // Merge data by year, respecting each source's valid year range
    const years = Array.from(allYears).sort();
    const merged = years.map((year) => {
      const row: Record<string, number | string> = { date: year.toString() };

      datasets.forEach((ds, index) => {
        const source = STAT_SOURCES[index];

        // Only include data if year is within the source's valid range
        if (year >= source.startYear && year <= source.endYear) {
          const yearData = ds.data.find((d) => d.year === year);
          if (yearData) {
            // Add all columns except 'year', prefixing with dataset identifier
            Object.entries(yearData).forEach(([key, value]) => {
              if (key !== "year") {
                row[`${ds.prefix}_${key}`] = value;
              }
            });
          }
        }
        // If year is outside range, don't add any data (undefined values won't be rendered)
      });

      return row;
    });

    return merged;
  } catch (error) {
    // console.error("Error loading stats data:", error);
    return [];
  }
}
