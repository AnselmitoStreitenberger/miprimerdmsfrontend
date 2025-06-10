import { useEffect, useState } from "react";
import axios from "axios";



export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [estado, setEstado] = useState("");
  const [conFecha, setConFecha] = useState("");
  const [cliente, setCliente] = useState("");
  const [page, setPage] = useState(1);
  const [clientesPopup, setClientesPopup] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showCodigoPopup, setShowCodigoPopup] = useState(false);
  const [codigoPedido, setCodigoPedido] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const limit = 3;

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const params = {
          page,
          limit,
          ...(estado && { estado }),
          ...(conFecha && { con_fecha: conFecha }),
          ...(cliente && { cliente })
        };
        const res = await axios.get("http://localhost:5000/api/pedidosarmado/agrupados", { params });
        setPedidos(res.data.resultados);
      } catch (err) {
        console.error("Error al obtener pedidos", err);
      }
    };

    fetchPedidos();
  }, [estado, conFecha, cliente, page]);

  const marcarComoPedidoAFabrica = async (pedidoId) => {
    try {
      await axios.patch(`http://localhost:5000/api/pedidos/${pedidoId}/marcar_enviado`);
      // Refrescar pedidos
      const params = {
        page,
        limit,
        ...(estado && { estado }),
        ...(conFecha && { con_fecha: conFecha }),
        ...(cliente && { cliente })
      };
      const res = await axios.get("http://localhost:5000/api/pedidosarmado/agrupados", { params });
      setPedidos(res.data.resultados);
    } catch (err) {
      console.error("Error al marcar como pedido a fábrica", err);
    }
  };


  const cargarCodigoPedido = async () => {
    if (!codigoPedido || !pedidoSeleccionado) return;

    try {
              await axios.patch(`http://localhost:5000/api/pedidos/${pedidoSeleccionado}/codigo`, {
                codigo_pedido: codigoPedido
              });

              // Luego de cargar el código, marcar como pedido a fábrica
              await marcarComoPedidoAFabrica(pedidoSeleccionado);
      setShowCodigoPopup(false);
      setCodigoPedido("");
      setPedidoSeleccionado(null);
      // Refrescar pedidos
      const res = await axios.get("http://localhost:5000/api/pedidosarmado/agrupados", {
        params: {
          page,
          limit,
          ...(estado && { estado }),
          ...(conFecha && { con_fecha: conFecha }),
          ...(cliente && { cliente })
        }
      });
      setPedidos(res.data.resultados);
    } catch (err) {
      console.error("Error al cargar el código", err);
    }
  };   

  return (
    <div className="p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Pedidos a Fábrica</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <select className="border p-2 rounded" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="para pedir">Para pedir</option>
          <option value="pedido">Pedido</option>
          <option value="recibido">Recibido</option>
          <option value="avisado">Avisado</option>
          <option value="sin stock fabrica">Sin stock fábrica</option>
        </select>

        <select className="border p-2 rounded" value={conFecha} onChange={(e) => setConFecha(e.target.value)}>
          <option value="">Todos</option>
          <option value="true">Con fecha de pedido</option>
          <option value="false">Sin enviar aún</option>
        </select>

        <input type="text" placeholder="Buscar por cliente" className="border p-2 rounded" value={cliente} onChange={(e) => setCliente(e.target.value)} />
      </div>

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <details key={pedido.pedido_id} className="border rounded-lg">
            <summary className="bg-gray-100 px-4 py-2 cursor-pointer flex justify-between items-center">
              <div>
                <div><strong>ID:</strong> {pedido.pedido_id}</div>
                <div>
                  <strong>Código fábrica:</strong> {pedido.codigo_pedido || (
                    <button
                     className="text-blue-600 underline"
                     onClick={(e) => {
                     e.stopPropagation();
                      setPedidoSeleccionado(pedido.pedido_id);
                      setShowCodigoPopup(true);
                      }}
                    >
                       Cargar código fábrica
                      </button>
                  )}
                </div>
                <div><strong>Fecha creación:</strong> {pedido.fecha_creacion?.slice(0, 10)}</div>
                <div>
                  <strong>Fecha pedido fábrica:</strong> {pedido.fecha_ped_fab ? pedido.fecha_ped_fab.slice(0, 10) : (
                  <div>
                    <strong>Fecha pedido fábrica:</strong>{" "}
                    {pedido.fecha_ped_fab ? (
                      pedido.fecha_ped_fab.slice(0, 10)
                    ) : (
                      <button
                        className="text-blue-600 underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          marcarComoPedidoAFabrica(pedido.pedido_id);
                        }}
                      >
                        Marcar como pedido a fábrica
                      </button>
                    )}
                  </div>
                  )}
                </div>
              </div>
            </summary>

            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Código de pieza</th>
                    <th className="text-left py-1">Cantidad solicitada</th>
                    <th className="text-left py-1">Cantidad recibida</th>
                    <th className="text-left py-1">Estado</th>
                    <th className="text-left py-1">Clientes</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.detalles.slice(0, 10).map((detalle) => (
                    <tr key={detalle.detalle_id} className="border-b">
                      <td className="py-1 flex items-center gap-2">
                        {detalle.codigo_pieza}
                        <button
                          className="text-sm text-blue-600 underline"
                          onClick={(e) => {
                            e.stopPropagation(); // por si se hace dentro de <details>
                            navigator.clipboard.writeText(detalle.codigo_pieza);
                          }}
                        >
                          Copiar
                        </button>
                      </td>
                      <td className="py-1">{detalle.cantidad_total}</td>
                      <td className="py-1">{detalle.cantidad_recibida ?? "-"}</td>
                      <td className="py-1">{detalle.estado}</td>
                      <td className="py-1">
                        <button
                          className="text-blue-600 underline"
                            onClick={(e) => {
                            e.stopPropagation(); // ⛔ evita que el evento se propague al <summary>
                            setClientesPopup(detalle.clientes);
                            setShowPopup(true);
                            }}
                          
                        >Ver clientes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 border rounded disabled:opacity-50" disabled={page === 1}>Anterior</button>
        <span className="self-center">Página {page}</span>
        <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border rounded">Siguiente</button>
      </div>

      {/* Popup de clientes */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Clientes</h2>
            <ul className="space-y-2">
              {clientesPopup.map((c, i) => (
                <li key={i}>
                  <strong>{c.nombre}</strong> ({c.telefono}) - {c.cantidad}u
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setShowPopup(false)}
            >Cerrar</button>
          </div>
        </div>
      )}
      {/* Popup para cargar código de pedido */}

      {showCodigoPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Cargar código fábrica</h2>
            <input
              type="text"
              className="border p-2 rounded w-full mb-4"
              placeholder="Ej: ABC123"
              value={codigoPedido}
              onChange={(e) => setCodigoPedido(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => {
                  setShowCodigoPopup(false);
                  setCodigoPedido("");
                  setPedidoSeleccionado(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={cargarCodigoPedido}
              >
                Cargar
              </button>
            </div>
          </div>
        </div>
      )}

  </div>
);
}






