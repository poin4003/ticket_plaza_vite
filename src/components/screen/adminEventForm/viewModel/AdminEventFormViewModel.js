import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { EventRepo } from "../../../../api/features/Event/EventRepo";

const EventSchema = Yup.object().shape({
  eventName: Yup.string()
    .required("Event name is required")
    .max(100, "Event name must be at most 100 characters"),
  location: Yup.string()
    .required("Location is required")
    .max(200, "Location must be at most 200 characters"),
  media: Yup.array().of(Yup.string()),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
});

const useAdminEventFormViewModel = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!eventId;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchEvent = async () => {
        try {
          const data = await EventRepo.getEventDetail(eventId);
          setEvent(data.data);
        } catch (err) {
          console.error("Error fetching event:", err);
          setError("Failed to load event. Please try again later.");
          toast.error("Failed to load event");
        } finally {
          setLoading(false);
        }
      };

      fetchEvent();
    }
  }, [eventId, isEditMode]);

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().slice(0, 16);
  };

  const initialValues = event
    ? {
        eventName: event.eventName || "",
        location: event.location || "",
        media: event.media || [""],
        startDate: formatDateForInput(event.startDate) || "",
        endDate: formatDateForInput(event.endDate) || "",
      }
    : {
        eventName: "",
        location: "",
        media: [""],
        startDate: "",
        endDate: "",
      };

  const handleSubmit = async (values) => {
    try {
      const cleanedValues = {
        ...values,
        media: values.media.filter((item) => item.trim() !== ""),
      };

      if (isEditMode) {
        await EventRepo.updateEvent(
          eventId,
          cleanedValues.eventName,
          cleanedValues.media,
          cleanedValues.location,
          cleanedValues.startDate,
          cleanedValues.endDate
        );
        toast.success("Event updated successfully");
      } else {
        await EventRepo.createEvent(
          cleanedValues.eventName,
          cleanedValues.media,
          cleanedValues.location,
          cleanedValues.startDate,
          cleanedValues.endDate
        );
        toast.success("Event created successfully");
      }

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error(
        isEditMode ? "Failed to update event" : "Failed to create event"
      );
    }
  };

  return {
    isEditMode,
    loading,
    error,
    initialValues,
    validationSchema: EventSchema,
    handleSubmit,
  };
};

export default useAdminEventFormViewModel;
