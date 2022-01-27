import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { StyledDashboard } from './index.style';

import { overviews } from './data';

const Dashboard = () => (
  <StyledDashboard>
    <div className="header">
      <Grid justifyContent="space-between" alignItems="center" display="flex">
        {overviews.map((item) => (
          <Box className="overview-item">
            <Typography className="text">{item.name}</Typography>
            <Typography className="text" variant="h4" fontWeight="500">
              {item.value}
            </Typography>
            <Typography className="text percent-growth-increment">
              {item.percentGrowth > 0 ? '+' : '-'}
              {item.percentGrowth}%
            </Typography>
          </Box>
        ))}
      </Grid>
    </div>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={6} lg={8}>
        <div className="main-item">Revenue</div>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={4}>
        <div className="main-item">Top Selling Product</div>
      </Grid>
    </Grid>
  </StyledDashboard>
);

export default Dashboard;
