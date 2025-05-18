import { useState } from 'react';
import Logo from '../../../common/Logo';
import useLoginAdminViewModel from '../viewModel/loginAdminViewModel';

function LoginAdminView() {
  const {
    isAuthenticated,
    loading,
    loginError,
    initialValues,
    validationSchema,
    handleSubmit,
  } = useLoginAdminViewModel();

  // State cho form
  const [formData, setFormData] = useState({
    email: initialValues.email || '',
    password: initialValues.password || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    validateField(name, value);
  };

  const validateField = (name, value) => {
    try {
      validationSchema.validateSyncAt(name, { [name]: value });
      setErrors((prev) => ({ ...prev, [name]: '' }));
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

  if (isAuthenticated && !loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            
            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md">
                {loginError}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Admin access only</span>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center text-sm text-gray-600">
                Secure
                <span>Secure authentication required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginAdminView;