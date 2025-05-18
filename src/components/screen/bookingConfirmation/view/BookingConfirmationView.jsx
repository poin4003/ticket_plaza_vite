import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Loading from '../../../common/Loading';
import useBookingConfirmationViewModel from '../viewModel/BookingConfirmationViewModel';

dayjs.extend(customParseFormat);

function BookingConfirmation() {
  const {
    booking,
    event,
    loading,
    error,
    copyBookingCode,
  } = useBookingConfirmationViewModel();

  if (loading) {
    return <Loading />;
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Booking not found.'}</p>
          <Link to="/home" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-600 text-white p-6 text-center">
            <span className="h-12 w-12 mx-auto mb-3">Confirmed</span>
            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p>Your tickets have been booked successfully.</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Booking Details</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={copyBookingCode}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Copy booking code"
                    title="Copy booking code"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-600">Booking Code</div>
                  <div className="font-mono font-medium">{booking.bookingCode}</div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-600">Ticket Type</div>
                  <div>{booking.ticket.ticketType}</div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-600">Quantity</div>
                  <div>{booking.quantity}</div>
                </div>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-600">Price per Ticket</div>
                  <div>${booking.ticket.price.toFixed(2)}</div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <div className="font-medium">Total Amount</div>
                  <div className="font-semibold">${booking.totalAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            {event && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Event Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="mr-3 text-gray-500">Date</span>
                    <div>
                      <div className="font-medium">{event.eventName}</div>
                      <div className="text-sm text-gray-600">
                        {dayjs(event.startDate).format('dddd, MMMM D, YYYY')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {dayjs(event.startDate).format('h:mm A')} - {dayjs(event.endDate).format('h:mm A')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="mr-3 text-gray-500">Location</span>
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-gray-600">{event.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                <div className="flex items-start">
                  <span className="mr-3 text-gray-500">Name</span>
                  <div>
                    <div className="text-sm text-gray-600">Full Name</div>
                    <div>{booking.user.fullName}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="mr-3 text-gray-500">Email</span>
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div>{booking.user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="mr-3 text-gray-500">Phone</span>
                  <div>
                    <div className="text-sm text-gray-600">Phone Number</div>
                    <div>{booking.user.phoneNumber}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-6">
                A confirmation email has been sent to your email address. Please keep your booking code for reference.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                <Link to="/home" className="btn-primary">
                  Browse More Events
                </Link>
                <Link to="/booking/lookup" className="btn-outline">
                  Look Up Booking
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;