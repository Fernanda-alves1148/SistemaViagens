import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationHeader from './NavigationHeader';

function Layout() {
  return (
    <div>
      <NavigationHeader />
      <main style={{ padding: '24px' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;