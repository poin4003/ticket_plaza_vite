import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EventRepo } from '../../../../api/features/Event/EventRepo'

const useEventDetailsViewModel = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const data = await EventRepo.getEventDetail(eventId);
        setEvent(data.data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  return {
    event,
    loading,
    error,
  };
};

export default useEventDetailsViewModel;