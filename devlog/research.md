# Direction change

Originally we decided to build our own mangrove classification model to identify mangrove extent over time periods and calculate mangrove loss, but then we found preprocessed data, thus allowing us to skip this step and save a lot of time. The only downside is that this data has a fixed resolution of 13x13m per pixel, which is fine for visualization, but since we're also crunching numbers for the line chart, we'll have to downscale the resolution of the SAR data to match.

The classification part would take too much time, and there would be no guarantee on quality anyway.
