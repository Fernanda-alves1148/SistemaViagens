import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '📊 Dashboard' },
    { path: '/planejar', label: '✈️ Planejar Viagem' },
    { path: '/despesas', label: '💰 Registrar Despesas' },
    { path: '/aprovar', label: '✅ Aprovar Viagem' },
  ];

  return (
    <header style={{
      background: '#2c3e50',
      color: 'white',
      padding: '0 24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px'
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: '700' }}>
          🌍 Sistema de Viagens
        </h1>
        <nav>
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '8px'
          }}>
            {menuItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  style={{
                    color: location.pathname === item.path ? '#3498db' : '#ecf0f1',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: location.pathname === item.path ? '600' : '400',
                    background: location.pathname === item.path ? 'rgba(52,152,219,0.15)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;