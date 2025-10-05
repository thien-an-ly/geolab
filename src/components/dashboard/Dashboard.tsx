import { TimeSeriesChart } from "../time-series-chart";
import { mockTimeSeriesData } from "../../utils/mockData";
import "./Dashboard.css";

export function Dashboard() {
  return (
    <div id="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-section">
          <TimeSeriesChart
            data={mockTimeSeriesData}
            title="Seasonal Trends - Kakadu National Park"
          />
        </div>

        <div className="dashboard-section">
          <h2>About This Tool</h2>
          <p>
            Kakadu Wetlands Sentinel visualizes satellite-derived ecological
            indicators including:
          </p>
          <ul>
            <li>
              🟢 <strong>Mangrove Gain</strong> - Areas showing increased
              mangrove coverage (2020-2024)
            </li>
            <li>
              🔴 <strong>Mangrove Loss</strong> - Areas with mangrove
              degradation (2025)
            </li>
            <li>📊 NDVI from Landsat (vegetation health)</li>
            <li>💧 Flood/drought signals from Sentinel-1 SAR</li>
            <li>🌲 Mangrove zones</li>
            <li>⚠️ Carbon loss correlation (Sentinel-5P + IPCC)</li>
          </ul>

          <h3>Current Data</h3>
          <p>
            <strong>TestGain.geojson:</strong> 202ha & 400ha showing vegetation
            gains
          </p>
          <p>
            <strong>TestLoss.geojson:</strong> 356ha & 560ha showing vegetation
            losses
          </p>
          <p>
            <strong>TestMangrove.geojson:</strong> 6 zones with density
            classification and carbon measurements
          </p>

          <h3>Technical Details</h3>
          <p>
            This tool visualizes correlations to support early-stage
            environmental analysis. Data sources include Landsat imagery,
            Sentinel-1 SAR, and Sentinel-5P atmospheric measurements combined
            with IPCC carbon coefficients.
          </p>

          <h3>Usage Notes</h3>
          <p>
            Use the Map View tab to explore geospatial data interactively. Click
            on map features to view detailed information. Toggle layers using
            the control panel to compare different ecological indicators.
          </p>
        </div>
      </div>
    </div>
  );
}
