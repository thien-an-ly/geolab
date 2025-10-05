export type StatSource = {
  path: string;
  prefix: string;
  startYear: number;
  endYear: number;
};

export const STAT_SOURCES: StatSource[] = [
  {
    path: "/stats/ndvi/NDVI_yearly_2014_2024_Kakadu_vegetation.csv",
    prefix: "vegetation",
    startYear: 2014,
    endYear: 2024,
  },
  {
    path: "/stats/ndvi/NDVI_yearly_2014_2024_Kakadu_mangrove.csv",
    prefix: "mangrove",
    startYear: 2014,
    endYear: 2024,
  },
  {
    path: "/stats/flood/Kakadu_TotalFloodArea_PerYear.csv",
    prefix: "flood",
    startYear: 2016,
    endYear: 2024,
  },
  {
    path: "/stats/mangrove/Kakadu_TotalMangroveArea_PerYear.csv",
    prefix: "mangrove_area",
    startYear: 2014,
    endYear: 2024,
  },
];
