import './App.css';
import { green , red} from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import AskThem from './components/AskThem';

const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: red[500],
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className='App'>
        <header className='App-header'>
          <AskThem />
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
