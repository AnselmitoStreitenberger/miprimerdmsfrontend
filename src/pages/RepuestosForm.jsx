import { useState } from "react";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBuscar = () => {
    fetch(`${API}/api/repuestos/codigo/${formData.codigo_pieza}`)
      .then(res => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then(data => {
        setFormData(data);
        setModoEdicion(true);
      })
      .catch(() => {
        alert("No se encontró el repuesto. Se procederá a crear uno nuevo.");
        setModoEdicion(false);
      });
  };

  const handleSubmit = () => {
    const method = modoEdicion ? "PUT" : "POST";
    const url = modoEdicion
      ? `${API}/api/repuestos/${formData.codigo_pieza}`
      : `${API}/api/repuestos/`;

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al guardar");
        alert("Repuesto guardado correctamente");
      })
      .catch(err => {
        console.error(err);
        alert("Error al guardar el repuesto.");
      });
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

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded">
        {modoEdicion ? "Actualizar" : "Crear"} Repuesto
      </button>
    </div>
  );
}
