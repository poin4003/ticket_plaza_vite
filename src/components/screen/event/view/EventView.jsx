import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Pagination from '../../../common/Pagingation';
import Loading from '../../../common/Loading';
import eventViewModel from '../viewModel/EventViewModel';

dayjs.extend(customParseFormat);

function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="card group">
      <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-200">
        {event.media && event.media.length > 0 ? (
          <img
            src={event?.media?.[0]}
            alt={event.eventName}
            className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {event.eventName}
        </h3>
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <span className="mr-1.5">Date:</span>
          <span>
            {dayjs(event.startDate).format('MMM D, YYYY - h:mm A')}
          </span>
        </div>
        <div className="mt-1 flex items-center text-sm text-gray-600">
          <span className="mr-1.5">Location:</span>
          <span>{event.location}</span>
        </div>
      </div>
    </Link>
  );
}

function EventView() {
  const {
    events,
    loading,
    error,
    searchTerm,
    page,
    totalPages,
    setSearchTerm,
    setPage,
    handleSearch,
    clearSearch,
  } = eventViewModel()

  if (loading && page === 0) {
    return <Loading />;
  }

  return (
    <div>
      <div className="bg-primary-800 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Discover and Book Amazing Events
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Find the hottest concerts, shows, and experiences in your area
            </p>

            <form
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto flex bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for events..."
                className="flex-grow px-4 py-3 focus:outline-none text-gray-900"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black opacity-30 z-0"></div> */}
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {'Upcoming Events'}
        </h2>

        {error && (
          <div className="text-center text-red-600 mb-8">
            <p>{error}</p>
          </div>
        )}

        {!loading && events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              {searchTerm
                ? `No events found matching "${searchTerm}"`
                : 'No upcoming events at this time'}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 btn-outline"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default EventView;