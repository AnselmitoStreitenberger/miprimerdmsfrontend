import { useState, useEffect } from "react";
import axios from "axios";

export default function Presupuestos() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [vehiculoId, setVehiculoId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [precio, setPrecio] = useState("");
  const [sePidio, setSePidio] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Para agregar repuestos
  const [codigoPieza, setCodigoPieza] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [repuestosPorPresupuesto, setRepuestosPorPresupuesto] = useState({});

  const fetchPresupuestos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/presupuestos");
      setPresupuestos(res.data);

      // Para cada presupuesto, traemos sus repuestos
      res.data.forEach(async (p) => {
        const items = await axios.get("http://localhost:5000/api/repuestospresupuestos/");
        const filtrados = items.data.filter((r) => r.presupuesto_id === p.id);
        setRepuestosPorPresupuesto((prev) => ({ ...prev, [p.id]: filtrados }));
      });
    } catch (error) {
      console.error("Error al cargar presupuestos", error);
    }
  };

  useEffect(() => {
    fetchPresupuestos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevo = {
        vehiculo_id: parseInt(vehiculoId),
        cliente_id: parseInt(clienteId),
        precio: parseFloat(precio),
        se_pidio: sePidio
      };
      await axios.post("http://localhost:5000/api/presupuestos", nuevo);
      setMensaje("Presupuesto creado con éxito");
      setVehiculoId("");
      setClienteId("");
      setPrecio("");
      setSePidio(false);
      fetchPresupuestos();
    } catch (error) {
      setMensaje("Error al guardar presupuesto");
      console.error(error);
    }
  };

  const agregarRepuesto = async (presupuesto_id) => {
    if (!codigoPieza || cantidad <= 0) return;

    try {
      await axios.post("http://localhost:5000/api/repuestospresupuestos/", {
        codigo_pieza: codigoPieza,
        presupuesto_id,
        cantidad: parseInt(cantidad),
      });
      setCodigoPieza("");
      setCantidad(1);
      fetchPresupuestos();
    } catch (err) {
      console.error("Error al agregar repuesto", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Presupuestos</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
        <div>
          <label className="block text-sm font-medium">Vehículo ID</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={vehiculoId}
            onChange={(e) => setVehiculoId(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Cliente ID</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Precio</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">¿Se pidió?</label>
          <input
            type="checkbox"
            checked={sePidio}
            onChange={(e) => setSePidio(e.target.checked)}
            className="ml-2"
          />
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Guardar presupuesto
        </button>
      </form>

      {mensaje && <div className="mt-4 text-sm text-green-700">{mensaje}</div>}

      <h2 className="text-xl font-semibold mt-8 mb-2">Listado de presupuestos</h2>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Vehículo ID</th>
            <th className="border p-2">Cliente ID</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Se pidió</th>
            <th className="border p-2">Repuestos</th>
          </tr>
        </thead>
        <tbody>
          {presupuestos.map((p) => (
            <tr key={p.id} className="align-top">
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.vehiculo_id}</td>
              <td className="border p-2">{p.cliente_id}</td>
              <td className="border p-2">${p.precio.toFixed(2)}</td>
              <td className="border p-2">{p.se_pidio ? "Sí" : "No"}</td>
              <td className="border p-2">
                <ul className="mb-2">
                  {(repuestosPorPresupuesto[p.id] || []).map((r, idx) => (
                    <li key={idx}>
                      {r.codigo_pieza} - {r.cantidad} u.
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Código pieza"
                    value={codigoPieza}
                    onChange={(e) => setCodigoPieza(e.target.value)}
                    className="border p-1 w-32"
                  />
                  <input
                    type="number"
                    value={cantidad}
                    min={1}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="border p-1 w-20"
                  />
                  <button
                    onClick={() => agregarRepuesto(p.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Agregar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
