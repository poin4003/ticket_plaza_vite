import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../../common/Loading";
import useAdminTicketFormViewModel from "../viewModel/AdminTicketFormViewModel";

function AdminTicketForm() {
  const {
    event,
    tickets,
    isEditMode,
    loading,
    error,
    initialValues,
    validationSchema,
    handleSubmit,
    handleDelete,
    showCreateModal,
    showUpdateModal,
    setShowCreateModal,
    setShowUpdateModal,
    selectedTicket,
    setSelectedTicket,
  } = useAdminTicketFormViewModel();

  const [formData, setFormData] = useState({
    ticketType: initialValues.ticketType || "",
    price: initialValues.price !== undefined ? initialValues.price.toString() : "",
    quantity: initialValues.quantity !== undefined ? initialValues.quantity.toString() : "",
    description: initialValues.description || "",
  });

  const [errors, setErrors] = useState({});

  if (loading) {
    return <Loading />;
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-md shadow-sm p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || "Event not found"}</p>
          <Link to="/admin/dashboard" className="btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    try {
      validationSchema.validateSyncAt(name, { [name]: value });
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        quantity: parseInt(formData.quantity, 10) || 1,
      };
      await validationSchema.validate(submissionData, { abortEarly: false });
      setErrors({});
      handleSubmit(submissionData);
      setShowCreateModal(false); // Close modal on success
      setShowUpdateModal(false); // Close modal on success
      setFormData({
        ticketType: "",
        price: "",
        quantity: "",
        description: "",
      });
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  const handleEditClick = (ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      ticketType: ticket.ticketType || "",
      price: ticket.price !== undefined ? ticket.price.toString() : "",
      quantity: ticket.quantity !== undefined ? ticket.quantity.toString() : "",
      description: ticket.description || "",
    });
    setShowUpdateModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Back to Events Link */}
      <div className="mb-6">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          Back to Events
        </Link>
      </div>

      {/* Event Header */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            Manage Tickets for {event.eventName}
          </h1>
          <p className="text-gray-600 mt-1">Event ID: {event.id}</p>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Ticket List</h2>
          <button
            onClick={() => {
              setFormData({
                ticketType: "",
                price: "",
                quantity: "",
                description: "",
              });
              setShowCreateModal(true);
            }}
            className="btn-primary flex items-center"
          >
            Add Ticket
          </button>
        </div>
        {tickets.length === 0 ? (
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Tickets Found
            </h3>
            <p className="text-gray-600 mb-4">
              This event has no tickets yet. Add a new ticket using the button above.
            </p>
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
                    Ticket Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
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
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.ticketType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${ticket.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(ticket)}
                          className="text-primary-600 hover:text-primary-900 p-1.5 hover:bg-gray-100 rounded-full"
                          title="Edit Ticket"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id, ticket.id)}
                          className="text-red-600 hover:text-red-900 p-1.5 hover:bg-gray-100 rounded-full"
                          title="Delete Ticket"
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
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md shadow-sm w-full max-w-md mx-4">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add New Ticket</h2>
            </div>
            <form className="p-6" onSubmit={onSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="ticketType" className="form-label">
                    Ticket Type
                  </label>
                  <input
                    id="ticketType"
                    name="ticketType"
                    type="text"
                    value={formData.ticketType}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., VIP, General Admission"
                  />
                  {errors.ticketType && (
                    <div className="form-error">{errors.ticketType}</div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="form-label">
                      Price ($)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      className="form-input"
                    />
                    {errors.price && <div className="form-error">{errors.price}</div>}
                  </div>

                  <div>
                    <label htmlFor="quantity" className="form-label">
                      Quantity Available
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="form-input"
                    />
                    {errors.quantity && (
                      <div className="form-error">{errors.quantity}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Describe what's included with this ticket type"
                  />
                  {errors.description && (
                    <div className="form-error">{errors.description}</div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={false} className="btn-primary">
                    Add Ticket
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Ticket Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md shadow-sm w-full max-w-md mx-4">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Ticket</h2>
            </div>
            <form className="p-6" onSubmit={onSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="ticketType" className="form-label">
                    Ticket Type
                  </label>
                  <input
                    id="ticketType"
                    name="ticketType"
                    type="text"
                    value={formData.ticketType}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., VIP, General Admission"
                  />
                  {errors.ticketType && (
                    <div className="form-error">{errors.ticketType}</div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="form-label">
                      Price ($)
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      className="form-input"
                    />
                    {errors.price && <div className="form-error">{errors.price}</div>}
                  </div>

                  <div>
                    <label htmlFor="quantity" className="form-label">
                      Quantity Available
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="form-input"
                    />
                    {errors.quantity && (
                      <div className="form-error">{errors.quantity}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Describe what's included with this ticket type"
                  />
                  {errors.description && (
                    <div className="form-error">{errors.description}</div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={false} className="btn-primary">
                    Update Ticket
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTicketForm;