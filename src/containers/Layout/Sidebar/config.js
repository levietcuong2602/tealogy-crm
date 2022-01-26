/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ROUTES from '@src/constants/route';
import { Icon } from '@mui/material';

export const sidebarMenu = [
  {
    key: 'BusinessAnalytics',
    heading: 'Business Analytic',
    icon: <Icon>analytics</Icon>,
    role: ['user'],
    subMenu: [
      {
        key: 'Dashboard',
        heading: 'Dashboard',
        route: ROUTES.BUSINESS_ANALYTIC_DASHBOARD,
        role: ['user'],
      },
      {
        key: 'SaleAnalytics',
        heading: 'Sale Analytics',
        route: ROUTES.SALE_ANALYTICS,
        role: ['user'],
      },
      {
        key: 'SaleForecast',
        heading: 'Sale Forecast',
        route: ROUTES.SALE_FORECAST,
        role: ['user'],
      },
    ],
  },
  {
    key: 'InventoryReport',
    heading: 'Inventory Report',
    icon: <Icon>assessment</Icon>,
    role: ['user'],
    subMenu: [
      {
        key: 'Dashboard',
        heading: 'Dashboard',
        route: ROUTES.BUSINESS_ANALYTIC_DASHBOARD,
        role: ['user'],
      },
      {
        key: 'Forecast',
        heading: 'Forecast',
        route: ROUTES.SALE_ANALYTICS,
        role: ['user'],
      },
      {
        key: 'CupsFormula',
        heading: "Cup's Formula",
        route: ROUTES.SALE_FORECAST,
        role: ['user'],
      },
    ],
  },
  {
    key: 'CustomerInsight',
    heading: 'Customer Insight',
    icon: <Icon>insights</Icon>,
    role: ['user'],
    subMenu: [
      {
        key: 'CRM',
        heading: 'CRM',
        route: ROUTES.BUSINESS_ANALYTIC_DASHBOARD,
        role: ['user'],
      },
      {
        key: 'CustomerAnalytics',
        heading: 'Customer Analytics',
        route: ROUTES.SALE_ANALYTICS,
        role: ['user'],
      },
    ],
  },
];
