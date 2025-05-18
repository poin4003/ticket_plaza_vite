import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BookingRepo } from '../../../../api/features/Booking/BookingRepo'
import { EventRepo } from '../../../../api/features/Event/EventRepo'

const useBookingConfirmationViewModel = () => {
  const { bookingCode } = useParams();
  const [booking, setBooking] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const bookingData = await BookingRepo.getBookingLookup(bookingCode);
        setBooking(bookingData.data);
        
        if (bookingData.data.eventId) {
          const eventData = await EventRepo.getEventDetail(bookingData.data.eventId);
          setEvent(eventData.data);
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (bookingCode) {
      fetchBookingDetails();
    }
  }, [bookingCode]);

  const copyBookingCode = () => {
    navigator.clipboard.writeText(bookingCode);
    toast.success('Booking code copied to clipboard');
  };

  return {
    booking,
    event,
    loading,
    error,
    copyBookingCode,
  };
};

export default useBookingConfirmationViewModel;