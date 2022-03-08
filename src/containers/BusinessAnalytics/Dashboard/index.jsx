import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  TextField,
} from '@mui/material';

import apis from '@src/apis';
import { useSearchParams, useCallApi } from '@src/hooks';
import StackedAreaChart from '@src/components/Charts/StackedAreaChart';
import CustomTable from '@src/components/CustomTable';
import CustomDatePickerRange from '@src/components/CustomDatePickerRange';

import { getDiffBetweenTwoDate } from '@src/utils/date';
import { formatNumber } from '@src/utils/formatNumber';

import { ALL, DATE_TIME_PICKER_TYPES } from '@src/constants';

import {
  StyledDashboard,
  StyledTopSellingProductTable,
  StyledMenuItem,
} from './index.style';

const Dashboard = () => {
  const { data: listShops, apiCaller: fetchListShops } = useCallApi(
    [],
    apis.shop.getListShops,
  );
  const {
    data: topSellingProducts,
    apiCaller: fetchTopSellingProducts,
    loading: loadingTopSelling,
  } = useCallApi([], apis.item.getTopSellingProducts);

  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const history = useHistory();
  const { addParams } = useSearchParams();

  const [dateMonth] = React.useState(new Date());
  const [statisticsRevenueData, setStatisticsRevenueData] = useState([]);
  const [stackedChartSeries, setStackedChartSeries] = useState([]);
  const [stackedChartCategories, setStackedChartCategories] = useState([]);
  const [overviewData, setOverviewData] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);

  const [filter, setFilter] = useState({
    shopId: null,
    startDate: moment().startOf('month'),
    endDate: moment().endOf('month'),
  });

  useEffect(() => {
    const searchParams = queryString.parse(location.search);
    const {
      shopId,
      startTime = moment().startOf('month').valueOf(),
      endTime = moment().endOf('month').valueOf(),
    } = searchParams;

    setFilter((prevState) => ({
      ...prevState,
      shopId,
      startDate: new Date(Number.parseInt(startTime, 10)),
      endDate: new Date(Number.parseInt(endTime, 10)),
    }));
  }, [location.search]);

  const handleChangeStartDate = (startDate) => {
    const startTime = new Date(moment(startDate).startOf('minute')).getTime();
    addParams({ startTime, page: 1 });
    setFilter({
      ...filter,
      startDate,
    });
  };

  const handleChangeEndDate = (endDate) => {
    const endTime = new Date(moment(endDate).endOf('minute')).getTime();
    addParams({ endTime, page: 1 });
    setFilter({
      ...filter,
      endDate,
    });
  };

  const handleRefresh = () => {
    history.replace({ search: '' });
    setFilter({
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month'),
    });
  };

  const handleChangeShop = (e) => {
    const shopId = e.target.value;
    addParams({ shopId, page: 1 });
    setFilter({ ...filter, shopId });
  };

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

  const getOverviewItems = async (startTime, endTime) => {
    try {
      setLoadingOverview(true);
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

    setLoadingOverview(false);
  };

  React.useEffect(() => {
    const { startDate, endDate } = filter;
    const startTime = moment(startDate).startOf('month').valueOf();
    const endTime = moment(endDate).endOf('month').valueOf();

    fetchListShops({
      pageSize: 100,
    });
    fetchTopSellingProducts({
      startTime,
      endTime,
    });
    getOverviewItems(startTime, endTime);
    getStatisticsRevenues(startTime, endTime);
  }, [filter, filter.shopId, filter.startDate, filter.endDate]);

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
          <TextField
            size="small"
            className="text-field"
            variant="outlined"
            value={filter.shopId}
            select
            label="Shops"
            onChange={handleChangeShop}
          >
            <StyledMenuItem value={ALL}>All Shops</StyledMenuItem>
            {listShops.map((item) => (
              <StyledMenuItem key={item.id} value={item.id}>
                {item.name}
              </StyledMenuItem>
            ))}
          </TextField>
        </Box>
        <Box display="flex" alignItems="flex-end">
          <CustomDatePickerRange
            type={DATE_TIME_PICKER_TYPES.DATE_TIME}
            isRefresh
            startDate={filter.startDate}
            endDate={filter.endDate}
            handleChangeStartDate={handleChangeStartDate}
            handleChangeEndDate={handleChangeEndDate}
            handleRefresh={handleRefresh}
          />
        </Box>
      </Grid>
      <div className="header">
        <Grid
          justifyContent="space-between"
          alignItems="center"
          display="flex"
          flexWrap="wrap"
        >
          {loadingOverview ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress color="primary" />
            </Box>
          ) : (
            overviewData.map((item) => (
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
            ))
          )}
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
                    page: 0,
                    limit: 10,
                    total: 10,
                    totalPages: 1,
                  }}
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
