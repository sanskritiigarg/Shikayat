import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import { ComplaintProvider } from './context/ComplaintContext.jsx';

// Placeholders for other pages
import SubmitComplaint from './pages/SubmitComplaint.jsx';
import ComplaintSuccess from './pages/ComplaintSuccess.jsx';
import TrackComplaint from './pages/TrackComplaint.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <ComplaintProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="submit" element={<SubmitComplaint />} />
            <Route path="success" element={<ComplaintSuccess />} />
            <Route path="track" element={<TrackComplaint />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ComplaintProvider>
  );
}

export default App;
