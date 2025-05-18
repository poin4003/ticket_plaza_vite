import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { EventRepo } from '../../../../api/features/Event/EventRepo'

const useAdminDashboardViewModel = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const limit = 10

  useEffect(() => {
    fetchEvents()
  }, [page])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await EventRepo.getEvents(page, limit, searchTerm)
      setEvents(response.data.content)
      setTotalPages(response.totalPages)
    } catch (err) {
      console.error('Error fetching events: ', err)
      setError('Failed to load events. Please try again later.')
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    fetchEvents()
  }

  const confirmDelete = (event) => {
    setEventToDelete(event)
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!eventToDelete) return

    try {
      await EventRepo.deleteEvent(eventToDelete.id)
      toast.success('Event deleted successfully')
      fetchEvents()
    } catch {
      console.error('Error deleting event: ', err);
      toast.error('Failed to delete event')
    } finally {
      setDeleteModalOpen(false)
      setEventToDelete(null)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setShowFilters(false)
    fetchEvents()
  }

  return {
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
    fetchEvents,
    handleSearch,
    confirmDelete,
    handleDelete,
    clearFilters,
  }
}

export default useAdminDashboardViewModel