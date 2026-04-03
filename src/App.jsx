import { AppLayout } from './components/layout/AppLayout';
import { DashboardProvider } from './context/DashboardContext';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <DashboardProvider>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </DashboardProvider>
  );
}

export default App;
