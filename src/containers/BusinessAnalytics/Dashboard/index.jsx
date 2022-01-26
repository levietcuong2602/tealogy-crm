import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { StyledDashboard } from './index.style';

import { overviews } from './data';

const Dashboard = () => (
  <StyledDashboard>
    <div className="header">
      <Grid container spacing={4} justifyContent="space-between">
        {overviews.map((item) => (
          <Grid item xs={3} sm={2} xl={1}>
            <Box
              sx={{
                width: 150,
                height: 100,
                backgroundColor: 'primary.dark',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
            >
              {item.name}
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  </StyledDashboard>
);

export default Dashboard;
