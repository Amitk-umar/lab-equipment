import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { AuthView } from './components/auth/AuthView';
import { Spinner } from './components/common/Spinner';
import MainApp from './MainApp';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return (
    <ThemeProvider>
      {user ? <MainApp /> : <AuthView />}
    </ThemeProvider>
  );
};

export default App;