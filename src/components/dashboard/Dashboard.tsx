import { useState, useEffect } from "react";
import { TimeSeriesChart } from "../time-series-chart";
import { Credits } from "../credits";
import { loadStatsData } from "../../utils/loadStatsData";
import type { TimeSeriesData } from "../../types";
import "./Dashboard.css";

export function Dashboard() {
  const [chartData, setChartData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const statsData = await loadStatsData();
        setChartData(statsData as TimeSeriesData[]);
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // console.error("Failed to load stats data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div id="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-section">
          {loading ? (
            <div className="dashboard-message">Loading data...</div>
          ) : chartData.length > 0 ? (
            <TimeSeriesChart
              data={chartData}
              title="Yearly Trends - Kakadu National Park (2014-2024)"
            />
          ) : (
            <div className="dashboard-message">No data available</div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>About This Tool</h2>
          <p>
            Project GeoLab is a static web-based visualization tool for
            monitoring ecological indicators and exploring their correlation
            with environmental change in Australia's Kakadu National Park. This
            tool provides interactive access to multi-temporal satellite data
            spanning 2014-2024.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li>
              <strong>Mangrove Distribution & Change</strong> - Year-over-year
              mangrove extent tracking with gain/loss analysis (2014-2024)
            </li>
            <li>
              <strong>Vegetation Health Monitoring</strong> - NDVI time series
              for mangrove-specific zones
            </li>
            <li>
              <strong>Flood Extent Mapping</strong> - Annual flood area
              measurements derived from SAR imagery (2016-2024)
            </li>
            <li>
              <strong>Carbon Dynamics</strong> - Spatial visualization of carbon
              gain, loss, and stock measurements
            </li>
            <li>
              <strong>Time Series Analysis</strong> - Interactive charts
              combining NDVI trends with area measurements
            </li>
          </ul>

          <h3>Data Sources</h3>
          <p>
            This project integrates multiple authoritative satellite-derived
            datasets:
          </p>
          <ul>
            <li>
              <strong>Global Mangrove Distribution</strong> - NASA's mangrove
              biomass and canopy height product providing baseline distribution
              and carbon stock estimates
            </li>
            <li>
              <strong>Landsat NDVI</strong> - USGS Landsat missions providing
              normalized difference vegetation index for vegetation health
              assessment (2014-2024)
            </li>
            <li>
              <strong>Sentinel-1 SAR</strong> - ESA's synthetic aperture radar
              for flood extent detection and hydrological monitoring
            </li>
            <li>
              <strong>Digital Earth Australia Mangroves</strong> - Annual
              mangrove extent mapping (Geoscience Australia) enabling change
              detection analysis
            </li>
          </ul>

          <h3>Technical Approach</h3>
          <p>
            This tool visualizes correlations to support early-stage
            environmental analysis. Data sources include Landsat imagery,
            Sentinel-1 SAR, and DEA mangroves combined with IPCC carbon
            coefficients.
          </p>

          <h3>Usage</h3>
          <p>
            Navigate to the <strong>Map View</strong> tab to explore spatial
            data layers. Use the control panel to toggle layer visibility and
            adjust the time slider to view temporal changes. Click on map
            features to view detailed attribute information. The{" "}
            <strong>Dashboard</strong> provides overview statistics and trends
            across the study period.
          </p>
        </div>

        <div className="dashboard-section">
          <Credits />
        </div>
      </div>
    </div>
  );
}
