import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../../common/Loading";
import useAdminEventFormViewModel from "../viewModel/AdminEventFormViewModel";

function AdminEventForm() {
  const {
    isEditMode,
    loading,
    error,
    initialValues,
    validationSchema,
    handleSubmit,
  } = useAdminEventFormViewModel();

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    eventName: "",
    location: "",
    startDate: "",
    endDate: "",
    media: [""],
  });

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        eventName: initialValues.eventName || "",
        location: initialValues.location || "",
        startDate: initialValues.startDate || "",
        endDate: initialValues.endDate || "",
        media: initialValues.media || [""],
      });
    }
  }, [
    initialValues.eventName,
    initialValues.location,
    initialValues.startDate,
    initialValues.endDate,
    JSON.stringify(initialValues.media),
  ]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-md shadow-sm p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
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

  const handleMediaChange = (index, value) => {
    const newMedia = [...formData.media];
    newMedia[index] = value;
    setFormData((prev) => ({ ...prev, media: newMedia }));

    validateField("media", newMedia);
  };

  const handleAddMedia = () => {
    setFormData((prev) => ({ ...prev, media: [...prev.media, ""] }));
  };

  const handleRemoveMedia = (index) => {
    const newMedia = formData.media.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, media: newMedia }));
    validateField("media", newMedia);
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
    <div className="max-w-3xl mx-auto px-4">
      <div className="mb-6">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          Back to Events
        </Link>
      </div>

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Event" : "Create Event"}
          </h1>
        </div>

        <form className="p-6" onSubmit={onSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="eventName" className="form-label">
                Event Name
              </label>
              <input
                id="eventName"
                name="eventName"
                type="text"
                value={formData.eventName}
                onChange={handleChange}
                className="form-input"
              />
              {errors.eventName && (
                <div className="form-error">{errors.eventName}</div>
              )}
            </div>

            <div>
              <label
                htmlFor="location"
                className="form-label flex items-center"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
              {errors.location && (
                <div className="form-error">{errors.location}</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="form-label flex items-center"
                >
                  Start Date & Time
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.startDate && (
                  <div className="form-error">{errors.startDate}</div>
                )}
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="form-label flex items-center"
                >
                  End Date & Time
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.endDate && (
                  <div className="form-error">{errors.endDate}</div>
                )}
              </div>
            </div>

            <div>
              <label className="form-label flex items-center">Media</label>
              <p className="text-sm text-gray-500 mb-2">
                Add image URLs for the event (e.g., "image1.jpg")
              </p>

              <div className="space-y-3">
                {formData.media.map((media, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      name={`media-${index}`}
                      type="text"
                      value={media}
                      onChange={(e) => handleMediaChange(index, e.target.value)}
                      className="form-input flex-grow"
                      placeholder="Image URL"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                      aria-label="Remove media"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddMedia}
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  Add Media
                </button>
              </div>
              {errors.media && <div className="form-error">{errors.media}</div>}
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
              <Link to="/admin/dashboard" className="btn-outline">
                Cancel
              </Link>
              <button type="submit" disabled={false} className="btn-primary">
                {false
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Event"
                  : "Create Event"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminEventForm;
