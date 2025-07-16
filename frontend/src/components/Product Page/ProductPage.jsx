import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import ProductLIst from '../ProductLIst';

export default function ProductPage() {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    document.title = 'Explore Products | EJAR';
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          {/* Hamburger Button - Visible on small screens only */}
          <button
            className="hamburger-btn d-md-none"
            onClick={toggleSidebar}
          >
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* Sidebar */}
          {showSidebar && (
            <div className="mobile-sidebar d-md-none col-12 col-md-3">
              <Sidebar closeSidebar={() => setShowSidebar(false)} />
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="d-none d-md-block col-md-3">
            <Sidebar />
          </div>

          {/* Product List */}
          <div className="col-12 col-md-9">
            <ProductLIst />
          </div>
        </div>
      </div>
    </>
  );
}
