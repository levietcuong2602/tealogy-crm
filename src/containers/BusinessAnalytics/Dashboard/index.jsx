import React, { useState } from 'react';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  TextField,
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import apis from '@src/apis';
import { usePagination } from '@src/hooks';
import StackedAreaChart from '@src/components/Charts/StackedAreaChart';
import CustomTable from '@src/components/CustomTable';

import { getDiffBetweenTwoDate } from '@src/utils/date';

import { StyledDashboard, StyledTopSellingProductTable } from './index.style';

import { overviews, topSellingProducts } from './data';

const Dashboard = () => {
  const {
    // data: productList,
    currentPage,
    currentSize,
    total,
    onChangePage,
    loading: loadingTopSelling,
  } = usePagination([], apis.hotline.getListHotlines, ['tab']);
  const { enqueueSnackbar } = useSnackbar();

  const handleChangePagination = (page) => {
    onChangePage(page);
  };
  const [dateMonth, setDateMonth] = React.useState(new Date());
  const [listShops, setListShops] = useState([]);
  const [statisticsRevenueData, setStatisticsRevenueData] = useState([]);
  const [stackedChartSeries, setStackedChartSeries] = useState([]);
  const [stackedChartCategories, setStackedChartCategories] = useState([]);

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

  const getListShops = async () => {
    try {
      const { status, results } = await apis.shop.getListShops({
        pageSize: 100,
      });
      if (status === 1) {
        setListShops(results.data);
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const getStatisticsRevenues = async (startTime, endTime) => {
    try {
      const { status, results } = await apis.item.getStatisticsRevenue({
        startTime,
        endTime,
      });
      if (status === 1) {
        setStatisticsRevenueData(results);
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  React.useEffect(() => {
    const startTime = moment(dateMonth).startOf('month').valueOf();
    const endTime = moment(dateMonth).endOf('month').valueOf();
    getListShops();
    getStatisticsRevenues(startTime, endTime);
  }, [dateMonth]);

  const handleStatisticsRevenue = () => {
    const startTime = moment(dateMonth).startOf('month').valueOf();
    const endTime = moment(dateMonth).endOf('month').valueOf();

    const revenueDataObj = {};
    statisticsRevenueData.forEach(({ date, shopId, totalRevenue }) => {
      if (!revenueDataObj[date]) revenueDataObj[date] = {};

      revenueDataObj[date][shopId] = totalRevenue;
    });

    const shopDataObj = {};
    listShops.forEach(({ id, name }) => {
      shopDataObj[id] = {
        name,
        data: [],
      };
    });

    // Difference in number of days
    const durationDays = getDiffBetweenTwoDate({
      start: startTime,
      end: endTime,
      unitOfTime: 'days',
    });
    const categories = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= durationDays; i++) {
      const day = moment(startTime).add(i, 'days').format('YYYY-MM-DD');
      categories.push(day);

      let revenueShopsInDate = {};
      if (revenueDataObj[day]) revenueShopsInDate = revenueDataObj[day];

      Object.keys(shopDataObj).forEach((shopId) => {
        let value = 0;
        if (revenueShopsInDate[shopId]) value = revenueShopsInDate[shopId];

        shopDataObj[shopId].data.push(value);
      });
    }

    const series = Object.values(shopDataObj);

    setStackedChartSeries(series);
    setStackedChartCategories(stackedChartCategories);
  };
  React.useEffect(() => {
    if (listShops.length > 0) {
      handleStatisticsRevenue();
    }
  }, [listShops, statisticsRevenueData]);

  return (
    <StyledDashboard>
      <Grid
        className="header"
        container
        display="flex"
        justifyContent="flex-end"
      >
        <Box display="flex" alignItems="flex-end">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              openTo="year"
              views={['year', 'month']}
              minDate={new Date('2012-03-01')}
              maxDate={new Date('2023-06-01')}
              value={dateMonth}
              onChange={(newValue) => {
                setDateMonth(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={null} />
              )}
            />
          </LocalizationProvider>
        </Box>
      </Grid>
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
              series={stackedChartSeries}
              categories={stackedChartCategories}
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
