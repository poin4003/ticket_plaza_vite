import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Loading from '../../../common/Loading';
import useEventDetailsViewModel from '../viewModel/EventDetailViewModel';

dayjs.extend(customParseFormat);

function EventDetails() {
  const { event, loading, error } = useEventDetailsViewModel();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link to="/home" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-700 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/home" className="btn-primary">
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const startDate = dayjs(event.startDate);
  const endDate = dayjs(event.endDate);

  return (
    <div>
      <div className="bg-gray-800 text-white relative">
        {event.media && event.media.length > 0 ? (
          <div className="relative h-64 md:h-96">
            <img 
              src={`https://source.unsplash.com/random/1600x900/?concert&sig=${event.id}`}
              alt={event.eventName}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        ) : (
          <div className="h-48 md:h-64 bg-primary-900"></div>
        )}
        
        <div className="container mx-auto px-4 py-8 absolute inset-x-0 bottom-0">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">
              {event.eventName}
            </h1>
            <div className="flex flex-wrap gap-y-3 gap-x-6 text-white">
              <div className="flex items-center">
                <span className="mr-2">Date:</span>
                <span>{startDate.format('dddd, MMMM D, YYYY')}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">Time:</span>
                <span>{startDate.format('h:mm A')} - {endDate.format('h:mm A')}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">Location:</span>
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">Tickets</span>
              Available Tickets
            </h2>
            
            {(!event.tickets || event.tickets.length === 0) ? (
              <div className="text-center py-6">
                <p className="text-gray-600">No tickets are currently available for this event.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {event.tickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-md p-4 hover:border-primary-200 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium text-lg">{ticket.ticketType}</h3>
                        <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">${ticket.price.toFixed(2)}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {ticket.quantity > 0 
                            ? `${ticket.quantity} tickets left` 
                            : 'Sold Out'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      {ticket.quantity > 0 ? (
                        <Link 
                          to={`/events/${event.id}/book/${ticket.id}`}
                          className="btn-primary w-full md:w-auto"
                        >
                          Book Now
                        </Link>
                      ) : (
                        <button 
                          disabled
                          className="btn bg-gray-300 text-gray-600 cursor-not-allowed w-full md:w-auto"
                        >
                          Sold Out
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">Info</span>
              Event Information
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">
                Join us for {event.eventName} at {event.location}. This exclusive event will be held on {startDate.format('MMMM D, YYYY')} from {startDate.format('h:mm A')} to {endDate.format('h:mm A')}.
              </p>
              <p className="text-gray-700 mt-4">
                Don't miss this opportunity to be part of an unforgettable experience. Book your tickets now to secure your spot!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;