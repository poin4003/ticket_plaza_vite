import { Link } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Pagination from "../../../common/Pagingation";
import Loading from "../../../common/Loading";
import useAdminDashboardViewModel from "../viewModel/AdminDashboardViewModel";

dayjs.extend(customParseFormat);

function AdminDashboard() {
  const {
    events,
    loading,
    error,
    page,
    totalPages,
    searchTerm,
    showFilters,
    deleteModalOpen,
    eventToDelete,
    setPage,
    setSearchTerm,
    setShowFilters,
    handleSearch,
    confirmDelete,
    handleDelete,
    clearFilters,
  } = useAdminDashboardViewModel();

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/admin/events/new"
            className="btn-primary flex items-center"
          >
            Create Event
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-md p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-grow relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="form-input pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              Search
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center"
          >
            Filters
          </button>

          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Start Date</label>
              <input type="date" className="form-input" />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input type="date" className="form-input" />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="btn-outline w-full"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-md overflow-hidden">
        {loading && page === 0 ? (
          <Loading />
        ) : error ? (
          <div className="p-6 text-center">
            <span className="text-red-500 mb-4">Error Icon</span>
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Error Loading Events
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button onClick={() => fetchEvents()} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Events Found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? `No events matching "${searchTerm}"`
                : "You haven't created any events yet."}
            </p>
            <Link
              to="/admin/events/new"
              className="btn-primary inline-flex items-center"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Event
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date & Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tickets
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-300 rounded-md overflow-hidden">
                          {event.media && event.media.length > 0 ? (
                            <img
                              src={`https://source.unsplash.com/random/100x100/?concert&sig=${event.id}`}
                              alt=""
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center bg-gray-200">
                              Calendar
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {event.eventName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {event.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm text-gray-900 flex items-center">
                          {dayjs(event.startDate).format("MMM D, YYYY")}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          {event.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/events/${event.id}/tickets/new`}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200"
                      >
                        Add Ticket
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/admin/events/${event.id}/edit`}
                          className="text-primary-600 hover:text-primary-900 p-1.5 hover:bg-gray-100 rounded-full"
                          title="Edit Event"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => confirmDelete(event)}
                          className="text-red-600 hover:text-red-900 p-1.5 hover:bg-gray-100 rounded-full"
                          title="Delete Event"
                        >
                          Delete
                        </button> 
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Event
                </h3>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Are you sure you want to delete
                <span className="font-semibold">
                  {" "}
                  "{eventToDelete?.eventName}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => deleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
