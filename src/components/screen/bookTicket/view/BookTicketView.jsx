import { useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../../common/Loading';
import useBookTicketViewModel from '../viewModel/BookTicketViewModel';

function BookTicket() {
  const {
    event,
    ticket,
    loading,
    error,
    initialValues,
    validationSchema,
    handleSubmit,
  } = useBookTicketViewModel();

  const [formData, setFormData] = useState({
    fullName: initialValues.fullName || '',
    email: initialValues.email || '',
    phoneNumber: initialValues.phoneNumber || '',
    quantity: initialValues.quantity || 1,
  });
  const [errors, setErrors] = useState({});

  if (loading) {
    return <Loading />;
  }

  if (error || !event || !ticket) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Ticket not found or no longer available.'}</p>
          <Link to={`/events/${event?.id || ''}`} className="btn-primary">
            Return to Event
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) : value }));

    validateField(name, name === 'quantity' ? parseInt(value) : value);
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link to={`/events/${event.id}`} className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          Back to event
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary-700 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Book Tickets</h1>
            <p>{event.eventName}</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold mb-3">Ticket Information</h2>
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-medium">{ticket.ticketType}</p>
                  <p className="text-sm text-gray-600">{ticket.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">${ticket.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{ticket.quantity} available</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={onSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="form-label flex items-center">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.fullName && <div className="form-error">{errors.fullName}</div>}
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label flex items-center">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="form-label flex items-center">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.phoneNumber && <div className="form-error">{errors.phoneNumber}</div>}
                </div>
                
                <div>
                  <label htmlFor="quantity" className="form-label">
                    Number of Tickets
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    max={ticket.quantity}
                    value={formData.quantity}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.quantity && <div className="form-error">{errors.quantity}</div>}
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-lg font-semibold">${(formData.quantity * ticket.price).toFixed(2)}</span>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formData.quantity > ticket.quantity}
                    className={`btn-primary w-full flex items-center justify-center ${
                      (formData.quantity > ticket.quantity) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {'Complete Booking'}
                  </button>
                  
                  {formData.quantity > ticket.quantity && (
                    <p className="text-red-600 text-sm mt-2 text-center">
                      Not enough tickets available. Maximum: {ticket.quantity}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookTicket;