import DataTable from './Table/DataTable';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme(); // Create your theme if needed

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <h1>Hello everyone</h1>
        <DataTable /> {/* Uncomment this line */}
      </div>
    </ThemeProvider>
  );
}

export default App;