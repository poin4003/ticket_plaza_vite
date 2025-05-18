import { 
  Children,
  createContext, 
  useEffect,
  useState,
  useContext,
} from "react"
import { authRepo } from "../api/features/Auth/AdminAuthRepo"

const AuthContext = createContext()
const adminCredencials = 'adminCredentials'

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedCredentials = localStorage.getItem(adminCredencials)
    if (storedCredentials) {
      const { username } = JSON.parse(storedCredentials)
      setUser({ username })
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const response = await authRepo.login(username, password)

    if (response && response.status === 200) {
      localStorage.setItem(adminCredencials, JSON.stringify({ username, password }))
      setUser({ username })
      setIsAuthenticated(true)
      return true
    } else {
      throw new Error('Login failed: Invalid response')
    } 
  }

  const logout = async () => {
    await authRepo.logout()

    localStorage.removeItem(adminCredencials)
    setUser(null)
    setIsAuthenticated(false)
    return true 
  }

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>
    {!loading && children}
  </AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext