import * as React from 'react';
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
// import CustomDatePicker from '@src/components/CustomDatePicker';

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

  // const { addParams, removeParams } = useSearchParams();
  // const location = useLocation();
  // const history = useHistory();
  // const [filter, setFilter] = useState({
  //   date: moment(new Date()).format(),
  // });
  const [dateValue, setDateValue] = React.useState(new Date());

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
              value={dateValue}
              onChange={(newValue) => {
                setDateValue(newValue);
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
