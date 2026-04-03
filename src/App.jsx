import { AppLayout } from './components/layout/AppLayout';
import { LayoutProvider } from './context/LayoutContext';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <LayoutProvider>
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    </LayoutProvider>
  );
}

export default App;
