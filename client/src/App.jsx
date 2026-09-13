import { Routes, Route } from "react-router-dom";
import Cart from "./pages/Cart.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import NotFound from "./pages/NotFound.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Checkout from "./pages/Checkout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/menu" element={<Menu />} />
        <Route
    path="/orders/:orderId"
    element={<OrderDetails />}
/>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
