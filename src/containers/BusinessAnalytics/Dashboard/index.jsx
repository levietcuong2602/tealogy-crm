import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  TextField,
  Tooltip,
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import apis from '@src/apis';
import { useSearchParams, useCallApi } from '@src/hooks';
import StackedAreaChart from '@src/components/Charts/StackedAreaChart';
import CustomTable from '@src/components/CustomTable';
import CustomDateRangePickerDay from '@src/components/CustomDateRangePickerDay';

import { getDiffBetweenTwoDate } from '@src/utils/date';
import { formatNumber } from '@src/utils/formatNumber';

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

  const { addParams, removeParams } = useSearchParams();

  const [statisticsRevenueData, setStatisticsRevenueData] = useState([]);
  const [stackedChartSeries, setStackedChartSeries] = useState([]);
  const [stackedChartCategories, setStackedChartCategories] = useState([]);
  const [overviewData, setOverviewData] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingChartRevenue, setLoadingChartRevenue] = useState(false);
  const [dateRange, setDateRange] = React.useState([
    moment().startOf('month'),
    moment().endOf('month'),
  ]);
  const [shopIdFilter, setShopIdFilter] = useState(null);
  const [shopSelect, setShopSelect] = useState(null);

  useEffect(() => {
    const searchParams = queryString.parse(location.search);
    const {
      shopId,
      startDate: startDateFromUrl = moment().startOf('month'),
      endDate: endDateFromUrl = moment().endOf('month'),
    } = searchParams;
    const [startDateValue, endDateValue] = dateRange;

    if (
      new Date(startDateFromUrl).valueOf() !==
        new Date(startDateValue).valueOf() ||
      new Date(endDateFromUrl).valueOf() !== new Date(endDateValue).valueOf()
    ) {
      setDateRange([new Date(startDateFromUrl), new Date(endDateFromUrl)]);
    }

    if (shopId && shopIdFilter !== shopId) {
      setShopIdFilter(shopId);
    }
  }, [location.search]);

  const handleRefreshDateRange = () => {
    const startDate = moment().startOf('month');
    const endDate = moment().endOf('month');

    addParams({ startDate, endDate });
    setDateRange([startDate, endDate]);
  };

  const handleChangeDateRange = (dateValue) => {
    const [startDate, endDate] = dateValue;
    addParams({ startDate, endDate });
    setDateRange(dateValue);
  };

  const handleAcceptDateRange = (dateValue) => {
    const [startDate, endDate] = dateValue;

    addParams({ startDate, endDate });
    setDateRange(dateValue);
  };

  const handleChangeShop = (e, shop) => {
    const shopId = e.target.value;
    setShopSelect(shop);
    if (!shop) {
      removeParams('shopId');
      return;
    }
    addParams({ shopId: shop.id });
    setShopIdFilter(shopId);
  };

  const filterOptions = createFilterOptions({
    stringify: ({ name }) => name,
  });

  const handleSearchShop = () => {};

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
      setLoadingChartRevenue(true);
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
    setLoadingChartRevenue(false);
  };

  const getOverviewItems = async ({ startTime, endTime, shopId }) => {
    try {
      setLoadingOverview(true);
      const { status, results } = await apis.item.getOverviewItems({
        startTime,
        endTime,
        shopId,
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

  useEffect(() => {
    fetchListShops({
      pageSize: 100,
    });
  }, []);

  useEffect(() => {
    const [startDate, endDate] = dateRange;
    const startTime = moment(startDate).startOf('day').valueOf();
    const endTime = moment(endDate).endOf('day').valueOf();

    fetchTopSellingProducts({
      startTime,
      endTime,
      shopId: shopIdFilter,
    });
    getOverviewItems({ startTime, endTime, shopId: shopIdFilter });
    getStatisticsRevenues(startTime, endTime);
  }, [shopIdFilter, dateRange]);

  const handleStatisticsRevenue = () => {
    const [startDate, endDate] = dateRange;
    const startTime = moment(startDate).startOf('day').valueOf();
    const endTime = moment(endDate).endOf('day').valueOf();

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
        let valueRevenue = 0;
        if (revenueShopsInDate[shopId])
          valueRevenue = revenueShopsInDate[shopId];

        shopDataObj[shopId].data.push(valueRevenue);
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
    if (shopIdFilter && listShops.length) {
      const shop = listShops.find(({ id }) => id === shopIdFilter);
      setShopSelect(shop);
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
          <Autocomplete
            size="small"
            disablePortal
            id="combo-box-demo"
            className="text-field"
            options={listShops}
            filterOptions={filterOptions}
            noOptionsText="No Data"
            value={shopSelect}
            onChange={handleChangeShop}
            getOptionLabel={(shop) => shop.name}
            renderOption={(props, shop) => (
              <Tooltip title={shop.name} placement="right">
                <StyledMenuItem key={shop.id} value={shop} {...props}>
                  {shop.name}
                </StyledMenuItem>
              </Tooltip>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Shop"
                onChange={(event, value) => handleSearchShop(value)}
              />
            )}
          />
        </Box>
        <Box display="flex" alignItems="flex-end">
          <CustomDateRangePickerDay
            dateRange={dateRange}
            onChangeDateRange={handleChangeDateRange}
            shouldShowRefreshButton
            onRefreshDateRange={handleRefreshDateRange}
            onAcceptDateRange={handleAcceptDateRange}
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
            {loadingChartRevenue ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <StackedAreaChart
                series={stackedChartSeries}
                categories={stackedChartCategories}
              />
            )}
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
