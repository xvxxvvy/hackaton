import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardKPIs from './DashboardKPIs';

export default function TablaSolicitudes({ usuarioActual }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    areaTrabajo: '',
    criticidad: 'Media'
  });

  const API_URL = 'http://localhost:5000/api/tickets';

  useEffect(() => {
    obtenerSolicitudes();
    if (usuarioActual.rol === 'admin' || usuarioActual.rol === 'tecnico') {
      obtenerTecnicos();
    }
  }, [usuarioActual]);

  const obtenerSolicitudes = async () => {
    try {
      const res = await axios.get(API_URL);
      setSolicitudes(res.data);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    }
  };

  const obtenerTecnicos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/tecnicos');
      setTecnicos(res.data);
    } catch (err) {
      console.error('Error al cargar lista de técnicos:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        ...form,
        solicitante: usuarioActual.id || usuarioActual._id
      });
      setForm({ titulo: '', descripcion: '', areaTrabajo: '', criticidad: 'Media' });
      obtenerSolicitudes(); // Recargar la tabla automáticamente
    } catch (err) {
      console.error('Error al crear solicitud:', err.response?.data || err.message);
    }
  };

  const actualizarTicket = async (id, nuevoEstado, nuevoTecnicoId) => {
    try {
      await axios.put(`${API_URL}/${id}`, {
        estado: nuevoEstado,
        tecnicoAsignado: nuevoTecnicoId || null
      });
      obtenerSolicitudes();
    } catch (err) {
      console.error('Error al actualizar el ticket:', err);
    }
  };

  return (
    <div style={{ marginTop: '20px', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2>Panel de Gestión de Mantenimiento</h2>

      {/* Tarjetas de Métricas KPIs */}
      <DashboardKPIs solicitudes={solicitudes} />

      {/* Formulario de Alta */}
      {(usuarioActual.rol === 'solicitante' || usuarioActual.rol === 'admin') && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '450px', padding: '15px', border: '1px solid #444', borderRadius: '6px', backgroundColor: '#1e1e1e' }}>
          <h3>Crear Nueva Solicitud</h3>
          <input 
            type="text" 
            placeholder="Título (ej: Fuga en tubería / Falla de motor)" 
            value={form.titulo} 
            onChange={(e) => setForm({ ...form, titulo: e.target.value })} 
            required 
            style={{ padding: '8px' }}
          />
          <textarea 
            placeholder="Descripción detallada de la avería" 
            value={form.descripcion} 
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })} 
            required 
            style={{ padding: '8px', minHeight: '60px' }}
          />
          <input 
            type="text" 
            placeholder="Área de Trabajo (ej: Línea de Envasado)" 
            value={form.areaTrabajo} 
            onChange={(e) => setForm({ ...form, areaTrabajo: e.target.value })} 
            required 
            style={{ padding: '8px' }}
          />
          <label style={{ fontSize: '14px' }}>Nivel de Criticidad:</label>
          <select value={form.criticidad} onChange={(e) => setForm({ ...form, criticidad: e.target.value })} style={{ padding: '8px' }}>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
            <option value="Crítica">Crítica</option>
          </select>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Enviar Solicitud
          </button>
        </form>
      )}

      {/* Listado de Solicitudes */}
      <h3>Historial de Solicitudes</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', borderColor: '#444' }}>
        <thead>
          <tr style={{ backgroundColor: '#222' }}>
            <th>Título</th>
            <th>Área</th>
            <th>Criticidad</th>
            <th>Solicitante</th>
            <th>Técnico Asignado</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No hay solicitudes registradas.</td>
            </tr>
          ) : (
            solicitudes.map((sol) => (
              <tr key={sol._id}>
                <td><strong>{sol.titulo}</strong><br/><small>{sol.descripcion}</small></td>
                <td>{sol.areaTrabajo}</td>
                <td>
                  <span style={{
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: sol.criticidad === 'Crítica' ? '#dc2626' : sol.criticidad === 'Alta' ? '#ea580c' : '#0284c7'
                  }}>
                    {sol.criticidad}
                  </span>
                </td>
                <td>{sol.solicitante?.nombre || 'Anónimo'}</td>
                <td>
                  {(usuarioActual.rol === 'admin' || usuarioActual.rol === 'tecnico') ? (
                    <select 
                      value={sol.tecnicoAsignado?._id || ''} 
                      onChange={(e) => actualizarTicket(sol._id, sol.estado, e.target.value)}
                      style={{ padding: '5px' }}
                    >
                      <option value="">-- Sin Asignar --</option>
                      {tecnicos.map(t => (
                        <option key={t._id} value={t._id}>{t.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    sol.tecnicoAsignado?.nombre || 'Sin Asignar'
                  )}
                </td>
                <td><strong>{sol.estado}</strong></td>
                <td>
                  {(usuarioActual.rol === 'admin' || usuarioActual.rol === 'tecnico') ? (
                    <select 
                      value={sol.estado} 
                      onChange={(e) => actualizarTicket(sol._id, e.target.value, sol.tecnicoAsignado?._id)}
                      style={{ padding: '5px' }}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Resuelto">Resuelto</option>
                    </select>
                  ) : (
                    <span>Sin acciones</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}