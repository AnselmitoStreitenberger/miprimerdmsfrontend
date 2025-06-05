import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState({ id: null, nombre: "", ano: "", codigo_manual: "" });
  const [editing, setEditing] = useState(false);

  const fetchVehiculos = () => {
    fetch(`${API}/api/vehiculos/`)
      .then((res) => res.json())
      .then((data) => setVehiculos(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const url = form.id
      ? `${API}/api/vehiculos/${form.id}`
      : `${API}/api/vehiculos/`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: form.nombre,
        ano: form.ano,
        codigo_manual: form.codigo_manual,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(() => {
        fetchVehiculos();
        setForm({ id: null, nombre: "", ano: "", codigo_manual: "" });
        setEditing(false);
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    if (!confirm("¿Estás seguro de eliminar este vehículo?")) return;
    fetch(`${API}/api/vehiculos/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        fetchVehiculos();
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Gestión de Vehículos</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setForm({ id: null, nombre: "", ano: "", codigo_manual: "" });
            setEditing(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Crear Vehículo
        </button>
      </div>

      <table className="w-full border shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Año</th>
            <th className="p-2 border">Código Manual</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id} className="hover:bg-gray-50">
              <td className="border p-2">{v.nombre}</td>
              <td className="border p-2">{v.ano}</td>
              <td className="border p-2">{v.codigo_manual}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => {
                    setForm(v);
                    setEditing(true);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white p-4 rounded shadow-md border"
        >
          <h3 className="text-lg font-semibold mb-4">
            {form.id ? "Editar Vehículo" : "Nuevo Vehículo"}
          </h3>

          <div className="mb-3">
            <label className="block font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium mb-1">Año</label>
            <input
              type="text"
              value={form.ano}
              onChange={(e) => setForm({ ...form, ano: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Código Manual</label>
            <input
              type="text"
              value={form.codigo_manual}
              onChange={(e) => setForm({ ...form, codigo_manual: e.target.value })}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setForm({ id: null, nombre: "", ano: "", codigo_manual: "" });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}