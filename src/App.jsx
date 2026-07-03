import React from 'react';
import { AuthProvider } from './Context/AuthContext';
import AppRoute from './Router/AppRoute';

function App() {
  return (
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  );
}

export default App;
