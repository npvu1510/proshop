// GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --backdrop-color: rgba(123, 138, 139, 0.65);
    --color-grey-0: #fff;
    --color-grey-100: #f3f4f6;

    --border-radius-tiny: 3px;
    --border-radius-sm: 5px;
    --border-radius-md: 7px;
    --border-radius-lg: 9px;
  }
`;

export default GlobalStyles;
