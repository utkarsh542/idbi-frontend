import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FinancialPlanning from './pages/FinancialPlanning';
import HealthScore from './pages/HealthScore';

function App() {
  const [customerId, setCustomerId] = useState("1"); 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout customerId={customerId} setCustomerId={setCustomerId} />}>
          <Route index element={<Dashboard customerId={customerId} />} />
          <Route path="planning" element={<FinancialPlanning />} />
          <Route path="health" element={<HealthScore customerId={customerId} />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
