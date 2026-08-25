import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TablaSolicitudes from './components/TablaSolicitudes';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      {!usuario ? (
        <Login onLoginSuccess={(u) => setUsuario(u)} />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
            <span>Bienvenido, <strong>{usuario.nombre}</strong> ({usuario.rol.toUpperCase()})</span>
            <button onClick={handleLogout} style={{ padding: '5px 10px', backgroundColor: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Cerrar Sesión
            </button>
          </div>
          <TablaSolicitudes usuarioActual={usuario} />
        </div>
      )}
    </div>
  );
}

export default App;