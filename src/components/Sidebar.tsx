import TimeSeriesChart from "./TimeSeriesChart";
import { mockTimeSeriesData } from "../utils/mockData";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  featureData?: {
    properties: Record<string, unknown>;
  } | null;
}

export default function Sidebar({
  isOpen,
  onClose,
  featureData,
}: SidebarProps) {
  if (!isOpen) return null;

  return (
    <div id="sidebar">
      <span id="closeSidebar" onClick={onClose}>
        ×
      </span>
      <h3>Feature Details</h3>
      {featureData ? (
        <>
          <table>
            <tbody>
              {Object.entries(featureData.properties).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}:</td>
                  <td>{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px" }}>
            <TimeSeriesChart
              data={mockTimeSeriesData}
              title="Seasonal Trends"
            />
          </div>
        </>
      ) : (
        <p>Click on a feature on the map to see details.</p>
      )}
      <div style={{ marginTop: "20px" }}>
        <h3>About This Tool</h3>
        <p style={{ lineHeight: 1.6, fontSize: "12px" }}>
          Kakadu Wetlands Sentinel visualizes satellite-derived ecological
          indicators including:
        </p>
        <ul style={{ lineHeight: 1.8, fontSize: "12px", paddingLeft: "20px" }}>
          <li>📊 NDVI from Landsat (vegetation health)</li>
          <li>💧 Flood/drought signals from Sentinel-1 SAR</li>
          <li>🌲 Mangrove zones and degraded forests</li>
          <li>⚠️ Carbon loss correlation (Sentinel-5P + IPCC)</li>
        </ul>
      </div>
    </div>
  );
}
