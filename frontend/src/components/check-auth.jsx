import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  const protectedUserRoutes = [
    "/shop/profile",
    "/shop/orders",
    "/shop/checkout",
    "/shop/paypal-return",
    "/shop/paypal-cancel",
    "/shop/payment-success",
    "/shop/payment-failed",
  ];

  const protectedAdminRoutes = [
    "/admin/dashboard",
    "/admin/product",
    "/admin/productList",
    "/admin/userList",
    "/admin/order",
    "/admin/settings",
  ];

  const publicRoutes = [
    "/shop/home",
    "/shop/listing",
    "/shop/product",
  ];

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" />;
    } else {
      if (user?.role === "admin" || user?.role === "super-admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  if (!isAuthenticated && publicRoutes.some(route => location.pathname.startsWith(route))) {
    return children;
  }

  if (!isAuthenticated && protectedUserRoutes.some(route => location.pathname.startsWith(route))) {
    return <Navigate to="/login" />;
  }

  if (!isAuthenticated && protectedAdminRoutes.some(route => location.pathname.startsWith(route))) {
    return <Navigate to="/login" />;
  }

  if (!isAuthenticated && !location.pathname.includes("/login")) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && location.pathname.includes("/login")) {
    if (user?.role === "admin" || user?.role === "super-admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    user?.role !== "super-admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    (user?.role === "admin" || user?.role === "super-admin") &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;