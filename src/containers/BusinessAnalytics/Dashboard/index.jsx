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
import { formatNumber } from '@src/utils/formatNumber';

import { StyledDashboard, StyledTopSellingProductTable } from './index.style';

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
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [overviewData, setOverviewData] = useState([]);

  const heads = [
    {
      label: 'Drink Item',
      valueName: 'productName',
      align: 'left',
    },
    {
      label: 'Qty.Cups',
      valueName: 'totalQuantity',
      align: 'left',
    },
    {
      label: 'Total Revenue',
      valueName: 'totalRetailPrice',
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

  const getTopSellingProducts = async (startTime, endTime) => {
    try {
      const { status, results } = await apis.item.getTopSellingProducts({
        startTime,
        endTime,
      });
      if (status === 1) {
        setTopSellingProducts(results.data);
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
  };

  const getOverviewItems = async (startTime, endTime) => {
    try {
      const { status, results } = await apis.item.getOverviewItems({
        startTime,
        endTime,
      });
      if (status === 1) {
        const OVERVIEW_MAPPING = {
          totalRevenues: {
            id: 1,
            name: 'Revenue',
            value: '',
            percentGrowth: '',
          },
          totalQuantities: {
            id: 2,
            name: 'Total Cups',
            value: '',
            percentGrowth: '',
          },
          totalNumberOrders: {
            id: 3,
            name: 'Number Orders',
            value: '',
            percentGrowth: '',
          },
          totalCustomers: {
            id: 4,
            name: 'Total Customers',
            value: '1',
            percentGrowth: 100,
          },
          totalNewCustomer: {
            id: 5,
            name: 'New Customers',
            value: '1',
            percentGrowth: 100,
          },
        };
        const { currentPeriod, beforePeriod } = results;
        Object.keys(currentPeriod).forEach((key) => {
          const currentValue = currentPeriod[key] || 0;
          const beforeValue = beforePeriod[key] || 0;

          OVERVIEW_MAPPING[key].value = currentValue;
          OVERVIEW_MAPPING[key].percentGrowth = beforeValue
            ? (((currentValue - beforeValue) * 100) / beforeValue).toFixed(2)
            : 0;
        });
        setOverviewData(Object.values(OVERVIEW_MAPPING));
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
    getTopSellingProducts(startTime, endTime);
    getStatisticsRevenues(startTime, endTime);
    getOverviewItems(startTime, endTime);
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
    setStackedChartCategories(categories);
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
          {overviewData.map((item) => (
            <Box className="overview-item" key={item.name}>
              <Typography className="text">{item.name}</Typography>
              <Typography className="text" variant="h4" fontWeight="500">
                {formatNumber(item.value)}
              </Typography>
              <Typography className="text percent-growth-increment">
                <span>
                  {item.percentGrowth > 0 ? '+' : ''}
                  {item.percentGrowth}%
                </span>
              </Typography>
            </Box>
          ))}
        </Grid>
      </div>
      <Grid className="revenue-container" container spacing={2}>
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
