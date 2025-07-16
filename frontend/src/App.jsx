import { Route, Router, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './components/HomePage/HomePage';
import ProductPage from './components/Product Page/ProductPage';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import ProfilePage from './components/ProfilePage/ProfilePage';
import ProductDetailsPage from './components/ProductDetailsPage/ProductDetailsPage';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Wishlist from './Pages/Wishlist/Wishlist';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ChatPage from './components/ChatPage/ChatPage';
import NotFound from './components/NotFound/NotFound';
import Search from './Pages/SearchPage/Search';
import RequestsPage from './components/RequestsPage/RequestsPage';
import ReviewPage from './Pages/Review/ReviewPage';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './ProtectedRoutes/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
  return (
    <>
      {/* scroll to the top when you change the page */}
      <ScrollToTop />
      {/*  */}
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="search" element={<Search />} />

          <Route element={<ProtectedRoute />}>
            <Route path="history" element={<ReviewPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="profile/:id" element={<ProfilePage />} />
            <Route path="chat/:chatId" element={<ChatPage />} />
            <Route path="requests" element={<RequestsPage />} />
          </Route>
        </Route>

        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;
