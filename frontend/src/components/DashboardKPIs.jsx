import React from 'react';

export default function DashboardKPIs({ solicitudes }) {
  const total = solicitudes.length;
  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente').length;
  const enProceso = solicitudes.filter(s => s.estado === 'En Proceso').length;
  const resueltos = solicitudes.filter(s => s.estado === 'Resuelto').length;
  const criticos = solicitudes.filter(s => s.criticidad === 'Crítica').length;

  const cardStyle = {
    flex: '1',
    minWidth: '150px',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#1e1e1e',
    border: '1px solid #333',
    textAlign: 'center'
  };

  return (
    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' }}>
      <div style={cardStyle}>
        <h4 style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>TOTAL SOLICITUDES</h4>
        <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#fff' }}>{total}</p>
      </div>
      <div style={cardStyle}>
        <h4 style={{ margin: 0, color: '#eab308', fontSize: '13px' }}>PENDIENTES</h4>
        <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#eab308' }}>{pendientes}</p>
      </div>
      <div style={cardStyle}>
        <h4 style={{ margin: 0, color: '#3b82f6', fontSize: '13px' }}>EN PROCESO</h4>
        <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#3b82f6' }}>{enProceso}</p>
      </div>
      <div style={cardStyle}>
        <h4 style={{ margin: 0, color: '#22c55e', fontSize: '13px' }}>RESUELTOS</h4>
        <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#22c55e' }}>{resueltos}</p>
      </div>
      <div style={cardStyle}>
        <h4 style={{ margin: 0, color: '#ef4444', fontSize: '13px' }}>CRÍTICAS</h4>
        <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#ef4444' }}>{criticos}</p>
      </div>
    </div>
  );
}