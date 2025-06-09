import { useState, useEffect } from "react";
import axios from "axios";

export default function Pedidos_Clientes() {
  const [pedidos, setPedidos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("");
  const [codigoPedido, setCodigoPedido] = useState("");
  const [page, setPage] = useState(1);
  const [codigoPieza, setCodigoPieza] = useState("");
  const limit = 10;

  const fetchPedidos = async () => {
    try {
      const params = {
        page,
        limit,
        ...(nombre && { nombre }),
        ...(estado && { estado }),
        ...(codigoPedido && { codigo_pedido: codigoPedido }),
        ...(codigoPieza && { codigo_pieza: codigoPieza })
      };
      const res = await axios.get("http://localhost:5000/api/pedidosclientes/filtrados", { params });
      setPedidos(res.data);
    } catch (error) {
      console.error("Error al cargar pedidos", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [page]);

  const handleBuscar = () => {
    setPage(1);
    fetchPedidos();
  };

   const estados = [
    "para pedir",
    "pedido",
    "recibido",
    "avisado",
    "sin stock fabrica"
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pedidos de Clientes</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Estado del pedido</option>
          {estados.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <input
            type="text"
            placeholder="Código de pieza"
            value={codigoPieza}
            onChange={(e) => setCodigoPieza(e.target.value)}
            className="border p-2 rounded"
            />
        <input
          type="text"
          placeholder="Código de pedido"
          value={codigoPedido}
          onChange={(e) => setCodigoPedido(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleBuscar}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Cliente</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Código de Pieza</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Seña</th>
            <th className="border p-2">Cantidad Recibida</th>
            <th className="border p-2">Fecha Recibido</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Código Pedido</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p, i) => (
            <tr key={i} className="hover:bg-gray-100">
              <td className="border p-2">{p.nombre}</td>
              <td className="border p-2">{p.telefono}</td>
              <td className="border p-2">{p.codigo_pieza}</td>
              <td className="border p-2">{p.cantidad}</td>
              <td className="border p-2">${p.senia?.toLocaleString()}</td>
              <td className="border p-2">{p.cantidad_recibida ?? "-"}</td>
              <td className="border p-2">{p.fecha_recibido ? new Date(p.fecha_recibido).toLocaleDateString() : "-"}</td>
              <td className="border p-2">{p.estado}</td>
              <td className="border p-2">{p.codigo_pedido}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">Página {page}</span>
        <button
          disabled={pedidos.length < limit}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
