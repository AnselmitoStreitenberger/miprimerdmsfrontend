import { useState, useEffect } from "react";
import axios from "axios";

export default function Crear_Pedidos() {
  const [clientes, setClientes] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [repuestoSeleccionado, setRepuestoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [senia, setSenia] = useState(0);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/clientes");
        console.log("Clientes cargados:", res.data);
        if (Array.isArray(res.data)) {
          setClientes(res.data);
        } else {
          console.error("Clientes no es un array", res.data);
          setClientes([]);
        }
      } catch (err) {
        console.error("Error al obtener clientes:", err);
        setClientes([]);
      }
    };

    const fetchRepuestos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/repuestos?per_page=1000");
        console.log("Repuestos cargados:", res.data);
        if (Array.isArray(res.data.results)) {
          setRepuestos(res.data.results);
        } else {
          console.error("La respuesta de repuestos no es un array:", res.data);
          setRepuestos([]);
        }
      } catch (err) {
        console.error("Error al obtener repuestos:", err);
        setRepuestos([]);
      }
    };

    fetchClientes();
    fetchRepuestos();
  }, []);

  const agregarAPedido = async () => {
    if (!clienteSeleccionado || !repuestoSeleccionado || cantidad <= 0) {
      setMensaje("Completa todos los campos correctamente");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/pedidosarmado/agregar", {
        cliente_id: clienteSeleccionado,
        codigo_pieza: repuestoSeleccionado,
        cantidad: parseInt(cantidad),
        senia: parseFloat(senia)
      });
      setMensaje("✅ Pedido actualizado correctamente");
    } catch (err) {
      setMensaje("❌ Error al agregar al pedido");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Crear Nuevo Pedido</h2>

      <div className="mb-4">
        <label className="block font-semibold">Seleccionar Cliente:</label>
        <select
          className="w-full p-2 border rounded"
          value={clienteSeleccionado || ""}
          onChange={(e) => setClienteSeleccionado(e.target.value)}
        >
          <option value="">-- Selecciona un cliente --</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} ({c.telefono})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Seleccionar Repuesto:</label>
        <select
          className="w-full p-2 border rounded"
          value={repuestoSeleccionado}
          onChange={(e) => setRepuestoSeleccionado(e.target.value)}
        >
          <option value="">-- Selecciona un repuesto --</option>
          {repuestos.map((r) => (
            <option key={r.codigo_pieza} value={r.codigo_pieza}>
              {r.codigo_pieza} - {r.descripcion}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Cantidad:</label>
        <input
          type="number"
          min="1"
          className="w-full p-2 border rounded"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Seña (opcional):</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full p-2 border rounded"
          value={senia}
          onChange={(e) => setSenia(e.target.value)}
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={agregarAPedido}
      >
        Agregar al Pedido Actual
      </button>

      {mensaje && <p className="mt-4 font-semibold">{mensaje}</p>}
    </div>
  );
}
