import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const useLoginAdminViewModel = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleSubmit = async (values) => {
    setLoginError(null);
    try {
      await login(values.email, values.password);
      toast.success("Login successful");
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Invalid email or password");
      toast.error("Login failed");
    }
  };

  return {
    isAuthenticated,
    loading,
    loginError,
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    handleSubmit,
  };
};

export default useLoginAdminViewModel;
