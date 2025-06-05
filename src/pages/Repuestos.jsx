import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Repuestos() {
  const [codigo, setCodigo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = () => {
    fetch(`${API}/api/repuestos?codigo_pieza=${encodeURIComponent(codigo)}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al buscar repuesto");
        return res.json();
      })
      .then(data => {
        setBuscado(true);
        setResultados(data.results || []);
        if (!data.results || data.results.length === 0) {
          alert("No se encontraron repuestos.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("No se pudo buscar el repuesto.");
        setBuscado(true);
        setResultados([]);
      });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Buscar Repuestos</h2>
      <div className="flex justify-center items-center mb-4">
        <input
          className="border p-2 mr-2 w-64"
          placeholder="Código de pieza"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button onClick={handleBuscar} className="bg-blue-600 text-white px-4 py-2 rounded">
          Buscar
        </button>
      </div>

      {buscado && resultados.length === 0 && (
        <p className="text-red-600 text-center">No se encontraron repuestos.</p>
      )}

      {resultados.length > 0 && (
        <table className="table-auto border-collapse w-full mt-4 shadow-md rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Código</th>
              <th className="border px-4 py-2">Descripción</th>
              <th className="border px-4 py-2">Precio</th>
              <th className="border px-4 py-2">Stock Mín</th>
              <th className="border px-4 py-2">Stock Real</th>
              <th className="border px-4 py-2">Stock Disp</th>
              <th className="border px-4 py-2">Vehículos</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2">{r.codigo_pieza}</td>
                <td className="border px-4 py-2">{r.descripcion}</td>
                <td className="border px-4 py-2">{r.precio}</td>
                <td className="border px-4 py-2">{r.stock_min}</td>
                <td className="border px-4 py-2">{r.stock_real}</td>
                <td className="border px-4 py-2">{r.stock_disp}</td>
                <td className="border px-4 py-2">
                  <select className="border p-1 w-full">
                    {r.vehiculos && r.vehiculos.length > 0 ? (
                      r.vehiculos.map((v, idx) => (
                        <option key={idx}>
                          {v.nombre} ({v.ano}) - {v.codigo_manual}
                        </option>
                      ))
                    ) : (
                      <option disabled>No asociados</option>
                    )}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

