import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import PageTransition from './components/PageTransition.jsx';
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
            <Route index element={
              <PageTransition>
                <Home />
              </PageTransition>
            } />
            <Route path="submit" element={
              <PageTransition>
                <SubmitComplaint />
              </PageTransition>
            } />
            <Route path="success" element={
              <PageTransition>
                <ComplaintSuccess />
              </PageTransition>
            } />
            <Route path="track" element={
              <PageTransition>
                <TrackComplaint />
              </PageTransition>
            } />
            <Route path="admin" element={
              <PageTransition>
                <AdminDashboard />
              </PageTransition>
            } />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ComplaintProvider>
  );
}

export default App;
