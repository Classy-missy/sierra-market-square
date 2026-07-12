import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Vendors from "@/pages/Vendors";
import Mentors from "@/pages/Mentors";
import RegisterCustomer from "@/pages/RegisterCustomer";
import RegisterMentor from "@/pages/RegisterMentor";
import RegisterVendor from "@/pages/RegisterVendor";
import VendorDetail from "@/pages/VendorDetail";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminRoute from "@/components/AdminRoute";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import VendorDashboard from "@/pages/VendorDashboard";
import MentorDashboard from "@/pages/MentorDashboard";

const PUBLIC_AUTH_ROUTES = ['/login', '/register', '/register-customer', '/register-vendor', '/register-mentor', '/forgot-password', '/reset-password'];

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.includes(location.pathname);

  // Show loading spinner while checking app public settings or auth
  if ((isLoadingPublicSettings || isLoadingAuth) && !isPublicAuthRoute) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError && !isPublicAuthRoute) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendors/:id" element={<VendorDetail />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/register-customer" element={<RegisterCustomer />} />
        <Route path="/register-mentor" element={<RegisterMentor />} />
        <Route path="/register-vendor" element={<RegisterVendor />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/mentor-dashboard" element={<MentorDashboard />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App