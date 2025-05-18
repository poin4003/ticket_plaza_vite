import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
// import { BookingRepo } from '../../../../api/features/Booking/BookingRepo'

const LookupSchema = Yup.object().shape({
  bookingCode: Yup.string()
    .required('Booking code is required')
    .matches(/^[A-Z0-9-]+$/, 'Invalid booking code format'),
});

const useBookingLookupViewModel = () => {
  const navigate = useNavigate();
  const [lookupError, setLookupError] = useState(null);

  const handleSubmit = async (values) => {
    setLookupError(null);
    try {
      console.log(values)
      // await BookingRepo.getBookingLookup(values.bookingCode);
      navigate(`/booking/confirmation/${values.bookingCode}`);
    } catch (err) {
      console.error('Lookup error:', err);
      setLookupError('Booking not found. Please check your booking code and try again.');
      toast.error('Booking not found');
    }
  };

  return {
    lookupError,
    initialValues: { bookingCode: '' },
    validationSchema: LookupSchema,
    handleSubmit,
  };
};

export default useBookingLookupViewModel;