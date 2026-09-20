import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/react";
import { Toaster } from "react-hot-toast";

import Cart from "./pages/Cart.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Checkout from "./pages/Checkout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const isAdmin = isSignedIn && user?.publicMetadata?.role === "admin";

  return (
    <MainLayout>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />}
        />

        <Route
          path="/admin/products"
          element={isAdmin ? <AdminProducts /> : <Navigate to="/" replace />}
        />

        <Route
          path="/admin/orders"
          element={isAdmin ? <AdminOrders /> : <Navigate to="/" replace />}
        />

        <Route path="/orders" element={<Orders />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<OrderSuccess />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
