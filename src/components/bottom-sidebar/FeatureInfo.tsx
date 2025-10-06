import "./FeatureInfo.css";
import {
  formatKey,
  formatValue,
  isKeyExcluded,
} from "../../utils/formatHelpers";
import type { MapLayerType } from "../../types";

interface FeatureInfoProps {
  feature: Record<string, unknown>;
  layerType?: MapLayerType;
  year: number;
}

export function FeatureInfo({ feature, layerType, year }: FeatureInfoProps) {
  // Pretty print all properties for flood or mangrove gain/loss features
  const isGainOrLoss = layerType === "mangrove-change";
  const isCarbonGainOrLoss =
    layerType === "carbon-gain" || layerType === "carbon-loss";
  const isCarbon = layerType === "carbon";

  // Determine year label and value based on layer type
  let yearLabel = "Year";
  let yearValue = year.toString();

  if (isGainOrLoss) {
    yearLabel = "Period";
    yearValue = `${year - 1} - ${year}`;
  } else if (isCarbonGainOrLoss) {
    yearLabel = "Period";
    yearValue = "2014 - 2024";
  } else if (isCarbon) {
    yearValue = "2014";
  }

  // Extract change_type for gain/loss features
  const changeType = feature.change_type as string | undefined;
  const isGain = changeType === "Gain";
  const isLoss = changeType === "Loss";
  const changeLabel = isGain ? "Mangrove gain" : "Mangrove loss";

  // Determine badge class based on layer type
  const getBadgeClass = () => {
    if (isGainOrLoss) {
      if (isGain) return "feature-type-badge feature-type-badge-gain";
      if (isLoss) return "feature-type-badge feature-type-badge-loss";
    }

    // Add layer-specific classes for other types
    switch (layerType) {
      case "mangrove":
        return "feature-type-badge feature-type-badge-mangrove";
      case "flood":
        return "feature-type-badge feature-type-badge-flood";
      case "carbon":
        return "feature-type-badge feature-type-badge-carbon";
      case "carbon-gain":
        return "feature-type-badge feature-type-badge-carbon-gain";
      case "carbon-loss":
        return "feature-type-badge feature-type-badge-carbon-loss";
      default:
        return "feature-type-badge";
    }
  };

  const badgeLabel = isGainOrLoss ? changeLabel : formatKey(layerType || "");

  // Check if this is a carbon layer to handle gridcode conversion
  const isCarbonLayer = isCarbon || isCarbonGainOrLoss;
  const gridcodeValue = feature.gridcode as number | undefined;

  return (
    <>
      {layerType && <div className={getBadgeClass()}>{badgeLabel}</div>}
      <div className="property-row">
        <span className="property-key">{yearLabel}:</span>
        <span className="property-value">{yearValue}</span>
      </div>
      {isCarbonLayer && gridcodeValue !== undefined && (
        <div className="property-row">
          <span className="property-key">Carbon Amount (tCO₂):</span>
          <span className="property-value">{formatValue(gridcodeValue)}</span>
        </div>
      )}
      {Object.entries(feature).map(([key, value]) => {
        if (isKeyExcluded(key)) return null;
        return (
          <div key={key} className="property-row">
            <span className="property-key">{formatKey(key)}:</span>
            <span className="property-value">{formatValue(value)}</span>
          </div>
        );
      })}
    </>
  );
}
