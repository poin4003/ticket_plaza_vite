import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { EventRepo } from '../../../../api/features/Event/EventRepo'
import { BookingRepo } from '../../../../api/features/Booking/BookingRepo'

const BookingSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\d{10,15}$/, 'Phone number must be between 10 and 15 digits')
    .required('Phone number is required'),
  quantity: Yup.number()
    .min(1, 'Must book at least 1 ticket')
    .required('Quantity is required'),
});

const useBookTicketViewModel = () => {
  const { eventId, ticketId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventAndTicket = async () => {
      setLoading(true);
      try {
        const eventData = await EventRepo.getEventDetail(eventId);
        setEvent(eventData.data);

        const foundTicket = eventData.data.tickets.find(t => t.id === parseInt(ticketId));
        if (!foundTicket) {
          throw new Error('Ticket not found');
        }
        setTicket(foundTicket);
      } catch (err) {
        console.error('Error fetching event/ticket details:', err);
        setError('Failed to load ticket information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndTicket();
  }, [eventId, ticketId]);


  const handleSubmit = async ({fullName, phoneNumber, email, quantity}) => {
    try {
      const response = await BookingRepo.bookTicket(ticketId, fullName, phoneNumber, email, quantity);
      toast.success('Ticket booked successfully!');
      navigate(`/booking/confirmation/${response.data.bookingCode}`);
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to book ticket. Please try again.');
    }
  };

  return {
    event,
    ticket,
    loading,
    error,
    initialValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      quantity: 1,
    },
    validationSchema: BookingSchema,
    handleSubmit,
  };
};

export default useBookTicketViewModel;