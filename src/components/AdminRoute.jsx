import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function AdminRoute() {
  const { isAuthenticated, isLoadingAuth, authChecked, user, checkUserAuth } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E8E2D5] border-t-[#00A0E3] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2] px-4">
        <div className="text-center max-w-md">
          <h1 className="font-heading text-2xl font-bold text-[#1A1612] mb-2">Access Denied</h1>
          <p className="text-[#1A1612]/60">
            You need administrator privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}