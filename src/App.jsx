import {Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import React from 'react';

function App ()  {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
