import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { EventRepo } from "../../../../api/features/Event/EventRepo";
import { TicketRepo } from "../../../../api/features/Ticket/TicketRepo";

const TicketSchema = Yup.object().shape({
  ticketType: Yup.string()
    .required("Ticket type is required")
    .max(50, "Ticket type must be at most 50 characters"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be a positive number"),
  quantity: Yup.number()
    .required("Quantity is required")
    .integer("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  description: Yup.string().max(
    200,
    "Description must be at most 200 characters"
  ),
});

const useAdminTicketFormViewModel = () => {
  const { eventId, ticketId } = useParams();
  const isEditMode = !!ticketId;

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch event and ticket data
  const fetchData = async () => {
    setLoading(true);
    try {
      const eventData = await EventRepo.getEventDetail(eventId);
      setEvent(eventData.data);
      setTickets(eventData.data.tickets.filter(t => !t.deleted) || []);

      if (isEditMode && eventData.data.tickets) {
        const foundTicket = eventData.data.tickets.find(
          (t) => t.id === parseInt(ticketId)
        );
        if (foundTicket) {
          setTicket(foundTicket);
          setSelectedTicket(foundTicket);
          setShowUpdateModal(true);
        } else {
          setError("Ticket not found");
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId, ticketId]);

  const initialValues = {
    ticketType: ticket?.ticketType || "",
    price: ticket?.price || 0,
    quantity: ticket?.quantity || 1,
    description: ticket?.description || "",
  };

  const handleSubmit = async ({ ticketType, price, quantity, description }) => {
    try {
      if (selectedTicket) {
        // Update mode
        await TicketRepo.updateTicket(eventId, selectedTicket.id, ticketType, price, quantity, description);
        toast.success("Ticket updated successfully");
      } else {
        // Create mode
        await TicketRepo.createTicket(eventId, ticketType, price, quantity, description);
        toast.success("Ticket added successfully");
      }

      // Refresh the ticket list after create/update
      await fetchData();

      // Reset the selected ticket and modal states
      setSelectedTicket(null);
      setShowCreateModal(false);
      setShowUpdateModal(false);
    } catch (err) {
      console.error("Error saving ticket:", err);
      toast.error(
        selectedTicket ? "Failed to update ticket" : "Failed to add ticket"
      );
    }
  };

  const handleDelete = async (eventId, ticketId) => {
    try {
      await TicketRepo.deleteTicket(eventId, ticketId);
      toast.success("Ticket deleted successfully");
      // Refresh the ticket list after deletion
      await fetchData();

      // If the deleted ticket was being edited, close the modal and reset
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(null);
        setShowUpdateModal(false);
      }
    } catch (err) {
      console.error("Error deleting ticket:", err);
      toast.error("Failed to delete ticket");
    }
  };

  return {
    event,
    tickets,
    isEditMode,
    loading,
    error,
    initialValues,
    validationSchema: TicketSchema,
    handleSubmit,
    handleDelete,
    showCreateModal,
    setShowCreateModal,
    showUpdateModal,
    setShowUpdateModal,
    selectedTicket,
    setSelectedTicket,
  };
};

export default useAdminTicketFormViewModel;