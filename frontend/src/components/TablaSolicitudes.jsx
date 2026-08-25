import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TablaSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    areaTrabajo: '',
    criticidad: 'Media',
    solicitante: '65f000000000000000000001' // ID temporal de prueba
  });

  const API_URL = 'http://localhost:5000/api/tickets';

  useEffect(() => {
    obtenerSolicitudes();
  }, []);

  const obtenerSolicitudes = async () => {
    try {
      const res = await axios.get(API_URL);
      setSolicitudes(res.data);
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      setForm({ titulo: '', descripcion: '', areaTrabajo: '', criticidad: 'Media', solicitante: '65f000000000000000000001' });
      obtenerSolicitudes();
    } catch (err) {
      console.error('Error al enviar solicitud:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2>Sistema de Gestión de Mantenimiento</h2>

      {/* Formulario de Alta */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <h3>Crear Nueva Solicitud</h3>
        <input 
          type="text" 
          placeholder="Título del problema" 
          value={form.titulo} 
          onChange={(e) => setForm({ ...form, titulo: e.target.value })} 
          required 
          style={{ padding: '8px' }}
        />
        <textarea 
          placeholder="Descripción detallada" 
          value={form.descripcion} 
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="text" 
          placeholder="Área de trabajo (ej: Línea 1)" 
          value={form.areaTrabajo} 
          onChange={(e) => setForm({ ...form, areaTrabajo: e.target.value })} 
          required 
          style={{ padding: '8px' }}
        />
        <select value={form.criticidad} onChange={(e) => setForm({ ...form, criticidad: e.target.value })} style={{ padding: '8px' }}>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
          <option value="Crítica">Crítica</option>
        </select>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Enviar Solicitud
        </button>
      </form>

      {/* Lista de Solicitudes */}
      <h3>Listado de Solicitudes</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Área</th>
            <th>Criticidad</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((sol) => (
            <tr key={sol._id}>
              <td>{sol.titulo}</td>
              <td>{sol.areaTrabajo}</td>
              <td>{sol.criticidad}</td>
              <td>{sol.estado}</td>
              <td>{new Date(sol.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}