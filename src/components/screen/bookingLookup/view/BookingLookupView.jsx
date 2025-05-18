import { useState } from 'react';
import useBookingLookupViewModel from '../viewModel/BookingLookupViewModel';

function BookingLookup() {
  const {
    lookupError,
    initialValues,
    validationSchema,
    handleSubmit,
  } = useBookingLookupViewModel();

  const [formData, setFormData] = useState({
    bookingCode: initialValues.bookingCode || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    validateField(name, value);
  };

  const validateField = (name, value) => {
    try {
      validationSchema.validateSyncAt(name, { [name]: value });
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      handleSubmit(formData);
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span className="h-12 w-12 mx-auto mb-4 text-primary-600">Ticket</span>
          <h1 className="text-3xl font-bold mb-2">Find Your Booking</h1>
          <p className="text-gray-600">
            Enter your booking code to retrieve your ticket information
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="bookingCode" className="form-label">
                Booking Code
              </label>
              <input
                id="bookingCode"
                name="bookingCode"
                type="text"
                value={formData.bookingCode}
                onChange={handleChange}
                className="form-input uppercase"
                placeholder="e.g. ABC-1234"
              />
              {errors.bookingCode && <div className="form-error">{errors.bookingCode}</div>}
            </div>
            
            {lookupError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {lookupError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={false} 
              className="btn-primary w-full flex items-center justify-center"
            >
              {'Searching...' ? 'Searching...' : 'Find Booking'} 
            </button>
          </form>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">How to find your booking code</h3>
            <p className="text-sm text-gray-600">
              Your booking code was sent to your email address when you completed your booking. 
              It's also displayed on your booking confirmation page. The format is usually
              something like "ABC-1234".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingLookup;