import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledDashboard = styled('div')`
  .header {
    background: #fff;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 25px;
    border-radius: 6px;

    .overview-item {
      border-radius: 20px;
      padding: 10px 20px;
      min-width: 150px;
      background-color: ${COLOR.light};

      .percent-growth-increment {
        color: green;
      }
    }
  }

  .main-item {
    background: #fff;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 25px;
    margin-top: 10px;
  }

  .text-field {
    background-color: white;
    height: fit-content;
    width: 420px;
    margin-right: 20px;
    margin-top: 8px;
    border-radius: 20px;

    .MuiInputBase-root {
      border-radius: 20px;
      input {
        font-size: 14px;
      }
    }
    .MuiInputBase-input {
      padding-top: 10.5px;
      padding-bottom: 10.5px;
    }
    .MuiInputLabel-root {
      font-size: 14px;
      font-weight: 500;
      color: ${COLOR.bodyText};
    }
  }
`;
