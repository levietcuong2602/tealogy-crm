import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import apis from '@src/apis';
import StackedAreaChart from '@src/components/Charts/StackedAreaChart';
import CustomTable from '@src/components/CustomTable';
import { usePagination } from '@src/hooks';

import { StyledDashboard, StyledTopSellingProductTable } from './index.style';

import {
  overviews,
  revenueData,
  revenueCategories,
  topSellingProducts,
} from './data';

const Dashboard = () => {
  const {
    // data: productList,
    currentPage,
    currentSize,
    total,
    onChangePage,
    loading: loadingTopSelling,
  } = usePagination([], apis.hotline.getListHotlines, ['tab']);

  const handleChangePagination = (page) => {
    onChangePage(page);
  };

  const heads = [
    {
      label: 'Drink Item',
      valueName: 'drinkItem',
      align: 'left',
    },
    {
      label: 'Qty.Cups',
      valueName: 'quantity',
      align: 'left',
    },
    {
      label: 'Total Revenue',
      valueName: 'totalRevenue',
      align: 'left',
    },
  ];

  return (
    <StyledDashboard>
      <div className="header">
        <Grid
          justifyContent="space-between"
          alignItems="center"
          display="flex"
          flexWrap="wrap"
        >
          {overviews.map((item) => (
            <Box className="overview-item" key={item.name}>
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
          <div className="revenue-order">
            <Typography className="text title">Revenue</Typography>
            <StackedAreaChart
              series={revenueData}
              categories={revenueCategories}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <div className="top-selling-product">
            <Typography className="title top-selling-product-header">
              Top Selling Product
            </Typography>
            {loadingTopSelling ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <StyledTopSellingProductTable>
                <CustomTable
                  items={topSellingProducts}
                  heads={heads}
                  pagination={{
                    page: currentPage,
                    limit: currentSize,
                    total,
                    totalPages: Math.ceil(total / currentSize, 10),
                  }}
                  onChangePagination={handleChangePagination}
                />
              </StyledTopSellingProductTable>
            )}
          </div>
        </Grid>
      </Grid>
    </StyledDashboard>
  );
};

export default Dashboard;
