import { MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';
import { BORDER_RADIUS } from '@src/styles/config';

export const StyledDashboard = styled('div')`
  .header {
    background: #fff;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 25px;
    border-radius: 6px;
    flex-wrap: wrap;
    margin-top: 10px;

    .overview-item {
      border-radius: 20px;
      padding: 10px 20px;
      min-width: 150px;
      background-color: ${COLOR.light};
      margin-top: 5px;

      .percent-growth-increment {
        color: green;
      }
    }
  }
  .text-field {
    background-color: #fff;
    width: 200px;
    height: fit-content;
    border-radius: ${BORDER_RADIUS};
    margin-right: 10px;
  }

  .revenue-container {
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }

  .revenue-order {
    background: #fff;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    margin-top: 10px;
    padding: 25px;
  }

  .top-selling-product {
    background: #fff;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    margin-top: 10px;
    .top-selling-product-header {
      padding: 25px;
    }
  }
  .title {
    font-weight: 600;
    text-decoration: underline;
  }
`;

export const StyledDatePicker = styled('div')`
  .MuiTypography-root {
    flex: 1 0 33.33%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: unset;
    background-color: transparent;
    border: 0px;
    outline: 0px;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.75;
    letter-spacing: 0.00938em;
    margin: 8px 0px;
    height: 36px;
    border-radius: 18px;
    cursor: pointer;
  }
`;

export const StyledTopSellingProductTable = styled('div')`
  .table {
    background: unset;
  }

  .head-cell {
    text-transform: uppercase;
    color: ${COLOR.bodyText};
    font-weight: 500;
    font-size: 12px;
    border-bottom: none;
  }

  .body-cell {
    font-size: 12px;
    border-bottom: 1px solid ${COLOR.tableHeader};
  }

  .body-row {
    cursor: pointer;
    border-radius: 10px;
    .btn-preview {
      display: none;
    }
    &:hover {
      background-color: ${COLOR.background};
      .btn-preview {
        display: block;
        padding: 0 15px;
      }
    }
  }

  .border-radius-top-left {
    border-top-left-radius: ${BORDER_RADIUS};
  }

  .border-radius-top-right {
    border-top-right-radius: ${BORDER_RADIUS};
  }

  .pagination-cell {
    border-bottom: none;
    border-bottom-right-radius: ${BORDER_RADIUS};
    border-bottom-left-radius: ${BORDER_RADIUS};
  }

  .pagination-text {
    font-size: 16px;
    font-weight: 500;
    color: ${COLOR.light};
  }

  .pagination {
    .MuiPaginationItem-root {
      font-size: 14px;
    }
    .Mui-selected {
      font-weight: bold;
      color: ${COLOR.white};
    }
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    font-weight: 500;
    &:focus {
      color: #fff;
      background-color: ${COLOR.primary};
      &:hover {
        background-color: ${COLOR.primary};
        color: #fff;
      }
    }
    &:hover {
      background-color: rgba(252, 102, 52, 0.12);
      &.MuiListItemIcon-root,
      &.MuiListItemText-primary {
        color: #fff;
      }
    }
  }
`;
