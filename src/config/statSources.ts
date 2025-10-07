export type StatSource = {
  path: string;
  prefix: string;
  startYear: number;
  endYear: number;
};

export const STAT_SOURCES: StatSource[] = [
  {
    path: `${
      import.meta.env.BASE_URL
    }stats/ndvi/NDVI_yearly_2014_2024_Kakadu_mangrove.csv`,
    prefix: "mangrove",
    startYear: 2014,
    endYear: 2024,
  },
  {
    path: `${
      import.meta.env.BASE_URL
    }stats/flood/Kakadu_TotalFloodArea_PerYear.csv`,
    prefix: "flood",
    startYear: 2016,
    endYear: 2024,
  },
  {
    path: `${
      import.meta.env.BASE_URL
    }stats/mangrove/Kakadu_TotalMangroveArea_PerYear.csv`,
    prefix: "mangrove_area",
    startYear: 2014,
    endYear: 2024,
  },
];

export const CARBON_STATS_SOURCE: StatSource[] = [
  {
    path: `${import.meta.env.BASE_URL}stats/carbon/carbon.json`,
    prefix: "carbon",
    startYear: 2014,
    endYear: 2014,
  },
  {
    path: `${import.meta.env.BASE_URL}stats/carbon/carbon-loss.json`,
    prefix: "carbon-loss",
    startYear: 2014,
    endYear: 2024,
  },
  {
    path: `${import.meta.env.BASE_URL}stats/carbon/carbon-gain.json`,
    prefix: "carbon-gain",
    startYear: 2014,
    endYear: 2024,
  },
];
