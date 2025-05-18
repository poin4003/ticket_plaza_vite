import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import NotFound from './components/common/NotFound';
import Loading from './components/common/Loading';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import EventView from './components/screen/event/view/EventView';
import EventDetails from './components/screen/eventDetails/view/EventDetailView';
import BookTicket from './components/screen/bookticket/view/BookTicketView';
import BookingLookup from './components/screen/bookingLookup/view/BookingLookupView';
import BookingConfirmation from './components/screen/bookingConfirmation/view/BookingConfirmationView';
import LoginAdminView from './components/screen/loginAdmin/view/LoginAdminView';
import AdminDashboard from './components/screen/adminDashboard/view/AdminDashboardView';
import AdminEventForm from './components/screen/adminEventForm/view/AdminEventFormView';
import AdminTicketForm from './components/screen/adminTicketForm/view/AdminTicketFormView';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Navigate to="/home" />} />
              <Route path="/home" element={<EventView />} />
              <Route path="/events/:eventId" element={<EventDetails />} />
              <Route path="/events/:eventId/book/:ticketId" element={<BookTicket />} />
              <Route path="/booking/lookup" element={<BookingLookup />} />
              <Route path="/booking/confirmation/:bookingCode" element={<BookingConfirmation />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/login" element={<LoginAdminView />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="events/new" element={<AdminEventForm />} />
              <Route path="events/:eventId/edit" element={<AdminEventForm />} />
              <Route path="events/:eventId/tickets/new" element={<AdminTicketForm />} />
              <Route path="events/:eventId/tickets/:ticketId/edit" element={<AdminTicketForm />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
