import { useState, useEffect } from 'react';
import { EventRepo } from '../../../../api/features/Event/EventRepo'

const useHomeViewModel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await EventRepo.getEvents(page, limit, searchTerm);
        setEvents(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  return {
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
  };
};

export default useHomeViewModel;