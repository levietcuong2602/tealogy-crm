import ROUTES from '@src/constants/route';
import BusinessAnalyticsDashboard from '@src/pages/BusinessAnalytics/Dashboard';

export default [
  {
    path: ROUTES.BUSINESS_ANALYTIC_DASHBOARD,
    component: BusinessAnalyticsDashboard,
    exact: true,
    restricted: false,
    isPrivate: true,
  },
];
