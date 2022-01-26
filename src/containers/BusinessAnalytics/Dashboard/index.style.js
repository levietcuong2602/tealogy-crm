import { styled } from '@mui/material/styles';
import { COLOR } from '@src/styles/color';

export const StyledDashboard = styled('div')`
  .header {
    background: #fff;
    border-radius: ${COLOR.primary};
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 25px;
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
