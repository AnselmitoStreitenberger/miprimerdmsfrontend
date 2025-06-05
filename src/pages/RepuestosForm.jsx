import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function RepuestosForm() {
  const [formData, setFormData] = useState({
    codigo_pieza: "",
    descripcion: "",
    precio: "",
    stock_min: "",
    stock_real: "",
    stock_disp: ""
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoIdsSeleccionados, setVehiculoIdsSeleccionados] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/vehiculos/`)
      .then(res => res.json())
      .then(data => setVehiculos(data))
      .catch(err => console.error("Error al cargar vehículos", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVehiculoSeleccion = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const ids = options.map(opt => parseInt(opt.value));
    setVehiculoIdsSeleccionados(ids);
  };

  const handleBuscar = async () => {
    try {
      const res = await fetch(`${API}/api/repuestos/codigo/${formData.codigo_pieza}`);
      if (!res.ok) throw new Error("No encontrado");
      const data = await res.json();
      setFormData(data);
      setModoEdicion(true);

      // Buscar relaciones actuales
      const relRes = await fetch(`${API}/api/repuestosvehiculos/por_codigo/${formData.codigo_pieza}`);
      const relData = await relRes.json();
      const actuales = relData.map(r => r.vehiculo_id);
      setVehiculoIdsSeleccionados(actuales);
    } catch {
      alert("No se encontró el repuesto. Se procederá a crear uno nuevo.");
      setModoEdicion(false);
      setVehiculoIdsSeleccionados([]);
    }
  };

  const handleSubmit = async () => {
    const method = modoEdicion ? "PUT" : "POST";
    const url = modoEdicion
      ? `${API}/api/repuestos/${formData.codigo_pieza}`
      : `${API}/api/repuestos/`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      alert("Error al guardar el repuesto.");
      return;
    }

    // Eliminar relaciones viejas
    const deleteRes = await fetch(`${API}/api/repuestosvehiculos/por_codigo/${formData.codigo_pieza}`);
    const relacionesViejas = await deleteRes.json();

    for (const rel of relacionesViejas) {
      await fetch(`${API}/api/repuestosvehiculos/${formData.codigo_pieza}/${rel.vehiculo_id}`, {
        method: "DELETE"
      });
    }

    // Crear nuevas relaciones
    const nuevasRelaciones = vehiculoIdsSeleccionados.map(vehiculo_id => ({
      codigo_pieza: formData.codigo_pieza,
      vehiculo_id
    }));

    await fetch(`${API}/api/repuestosvehiculos/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevasRelaciones)
    });

    alert("Repuesto guardado y relaciones actualizadas");
    setModoEdicion(true);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Cargar / Editar Repuestos</h2>

      <div className="mb-4">
        <label className="block font-semibold">Código de Pieza</label>
        <input
          name="codigo_pieza"
          value={formData.codigo_pieza}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button onClick={handleBuscar} className="mt-2 bg-gray-600 text-white px-4 py-1 rounded">
          Buscar para Editar
        </button>
      </div>

      {["descripcion", "precio", "stock_min", "stock_real", "stock_disp"].map((field) => (
        <div className="mb-4" key={field}>
          <label className="block font-semibold capitalize">{field.replace("_", " ")}</label>
          <input
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="border p-2 w-full"
            type={field === "descripcion" ? "text" : "number"}
          />
        </div>
      ))}

      <div className="mb-6">
        <label className="block font-semibold mb-2">Vehículos asociados:</label>
        <select
          multiple
          value={vehiculoIdsSeleccionados}
          onChange={handleVehiculoSeleccion}
          className="border p-2 w-full h-40"
        >
          {vehiculos.map(v => (
            <option key={v.id} value={v.id}>
              {v.nombre} ({v.codigo_manual})
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded w-full">
        {modoEdicion ? "Actualizar" : "Crear"} Repuesto
      </button>
    </div>
  );
}
