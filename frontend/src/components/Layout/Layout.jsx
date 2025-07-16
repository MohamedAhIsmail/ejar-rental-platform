import React, { Children } from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import ListItemModal from '../ListItemModal/ListItemModal';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <ListItemModal/>
      <Outlet />
      {children}
      <Footer />
    </>
  );
}
