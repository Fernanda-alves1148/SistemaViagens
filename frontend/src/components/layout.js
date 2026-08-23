import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <div>
      <Header />
      <main style={{ padding: '24px' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;