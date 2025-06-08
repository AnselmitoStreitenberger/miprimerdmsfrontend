import { useState, useEffect } from "react";
import axios from "axios";

export default function Clientes() {
  const [formVisible, setFormVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [clientes, setClientes] = useState([]);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const fetchClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Error al cargar clientes", error);
    }
  };

  const buscarClientes = async (term) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/clientes/buscar?term=${term}`);
      setClientes(res.data);
    } catch (error) {
      console.error("Error buscando clientes", error);
    }
  };

  useEffect(() => {
    if (busqueda.trim() === "") {
      fetchClientes();
    } else {
      buscarClientes(busqueda);
    }
  }, [busqueda]);

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoCliente = {
        nombre: nombre || null,
        telefono: telefono || null,
        direccion: direccion || null,
        correo_electronico: correo || null
      };

      if (editando) {
        await axios.put(`http://localhost:5000/api/clientes/${editando}`, nuevoCliente);
        setMensaje("Cliente actualizado con éxito");
      } else {
        await axios.post("http://localhost:5000/api/clientes", nuevoCliente);
        setMensaje("Cliente agregado con éxito");
      }

      setNombre("");
      setTelefono("");
      setDireccion("");
      setCorreo("");
      setFormVisible(false);
      setEditando(null);
      fetchClientes();
    } catch (error) {
      setMensaje("Error al guardar cliente");
      console.error(error);
    }
  };

  const handleEditar = (cliente) => {
    setNombre(cliente.nombre || "");
    setTelefono(cliente.telefono || "");
    setDireccion(cliente.direccion || "");
    setCorreo(cliente.correo_electronico || "");
    setEditando(cliente.id);
    setFormVisible(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/clientes/${id}`);
      fetchClientes();
      setMensaje("Cliente eliminado");
    } catch (error) {
      setMensaje("Error al eliminar cliente");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => {
            setFormVisible(!formVisible);
            setEditando(null);
            setNombre("");
            setTelefono("");
            setDireccion("");
            setCorreo("");
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {formVisible ? "Cancelar" : "Agregar cliente"}
        </button>

        <input
          type="text"
          placeholder="Buscar por cualquier campo"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-2 border rounded flex-grow"
        />
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Teléfono</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Dirección</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Correo electrónico</label>
            <input
              type="email"
              className="border p-2 rounded w-full"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editando ? "Actualizar cliente" : "Guardar cliente"}
          </button>
        </form>
      )}

      {mensaje && <div className="mt-4 text-sm text-green-700">{mensaje}</div>}

      <h2 className="text-xl font-semibold mt-8 mb-2">Listado de clientes</h2>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Dirección</th>
            <th className="border p-2">Correo</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.nombre}</td>
              <td className="border p-2">{c.telefono}</td>
              <td className="border p-2">{c.direccion || "-"}</td>
              <td className="border p-2">{c.correo_electronico || "-"}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEditar(c)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(c.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
