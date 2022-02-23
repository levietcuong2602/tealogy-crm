import api from './api';

export const getStatisticsRevenue = async (params) => {
  const res = await api({
    method: 'GET',
    url: '/items/statistics-revenues',
    params,
  });
  return res;
};
