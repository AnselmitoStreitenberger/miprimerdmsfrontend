import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Repuestos() {
  const [codigo, setCodigo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscado, setBuscado] = useState(false);
  const [vehiculosPorCodigo, setVehiculosPorCodigo] = useState({});
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [vehiculosVisibles, setVehiculosVisibles] = useState({});
  const [compatiblesPorCodigo, setCompatiblesPorCodigo] = useState({});
  const [compatiblesVisibles, setCompatiblesVisibles] = useState({});


  useEffect(() => {
    fetch(`${API}/api/vehiculos/`)
      .then((res) => res.json())
      .then((data) => setVehiculosDisponibles(data))
      .catch((err) => console.error("Error al cargar vehículos", err));
  }, []);

  const handleBuscar = () => {
    fetch(`${API}/api/repuestos?codigo_pieza=${encodeURIComponent(codigo)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al buscar repuesto");
        return res.json();
      })
      .then((data) => {
        setBuscado(true);
        setResultados(data.results || []);
      })
      .catch((err) => {
        console.error(err);
        alert("No se pudo buscar el repuesto.");
        setBuscado(true);
        setResultados([]);
      });
  };

  
  const toggleMostrarCompatibles = async (codigo_pieza) => {
    if (compatiblesVisibles[codigo_pieza]) {
      setCompatiblesVisibles({ ...compatiblesVisibles, [codigo_pieza]: false });
      return;
    }

    if (!compatiblesPorCodigo[codigo_pieza]) {
      try {
        const res = await fetch(`${API}/api/repuestoscompatibles/${codigo_pieza}`);
        if (!res.ok) throw new Error("Error al obtener compatibles");
        const compatibles = await res.json();
        setCompatiblesPorCodigo((prev) => ({ ...prev, [codigo_pieza]: compatibles }));
      } catch (error) {
        console.error("Error al obtener compatibles:", error);
        setCompatiblesPorCodigo((prev) => ({ ...prev, [codigo_pieza]: [] }));
      }
    }

    setCompatiblesVisibles({ ...compatiblesVisibles, [codigo_pieza]: true });
  };


  const toggleMostrarVehiculos = async (codigo_pieza) => {
    // Si ya está visible, lo ocultamos
    if (vehiculosVisibles[codigo_pieza]) {
      setVehiculosVisibles({ ...vehiculosVisibles, [codigo_pieza]: false });
      return;
    }

    // Si no está cargado, lo buscamos
    if (!vehiculosPorCodigo[codigo_pieza]) {
      try {
        const res = await fetch(`${API}/api/repuestosvehiculos/por_codigo/${codigo_pieza}`);
        if (!res.ok) throw new Error("Error al obtener vehículos");

        const relaciones = await res.json();
        const lista = relaciones.map((item) => {
          const v = vehiculosDisponibles.find((veh) => veh.id === item.vehiculo_id);
          return v ? `${v.nombre} (${v.ano})` : `ID ${item.vehiculo_id}`;
        });

        setVehiculosPorCodigo((prev) => ({ ...prev, [codigo_pieza]: lista }));
      } catch (error) {
        console.error("Error al obtener vehículos asociados:", error);
        setVehiculosPorCodigo((prev) => ({ ...prev, [codigo_pieza]: [] }));
      }
    }

    // Mostrar en pantalla
    setVehiculosVisibles({ ...vehiculosVisibles, [codigo_pieza]: true });
  };

  return (
    <div className="max-w-5xl mx-auto">
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
            <tr className="bg-gray-100 text-center">
              <th className="border px-4 py-2">Código</th>
              <th className="border px-4 py-2">Descripción</th>
              <th className="border px-4 py-2">Precio</th>
              <th className="border px-4 py-2">Stock Mín</th>
              <th className="border px-4 py-2">Stock Real</th>
              <th className="border px-4 py-2">Stock Disp</th>
              <th className="border px-4 py-2">Vehículos</th>
              <th className="border px-4 py-2">Compatibles</th>
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
                  <button
                    onClick={() => toggleMostrarVehiculos(r.codigo_pieza)}
                    className="text-blue-600 underline"
                  >
                    Vehículos asociados
                  </button>
                  {vehiculosVisibles[r.codigo_pieza] && (
                    <ul className="mt-2 list-disc list-inside text-left">
                      {(vehiculosPorCodigo[r.codigo_pieza] || []).map((desc, idx) => (
                        <li key={idx}>{desc}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => toggleMostrarCompatibles(r.codigo_pieza)}
                    className="text-green-600 underline"
                  >
                    Compatibles
                  </button>
                  {compatiblesVisibles[r.codigo_pieza] && (
                    <ul className="mt-2 list-disc list-inside text-left">
                      {(compatiblesPorCodigo[r.codigo_pieza] || []).map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}