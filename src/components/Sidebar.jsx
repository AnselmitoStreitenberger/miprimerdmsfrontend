import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold mb-6">Menú</h1>
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="hover:bg-gray-700 p-2 rounded">
          Inicio
        </Link>
        <Link to="/repuestos" className="hover:bg-gray-700 p-2 rounded">
          Buscar Repuestos
        </Link>
        <Link to="/repuestos/cargar" className="hover:bg-gray-700 p-2 rounded">
          Cargar Repuesto
        </Link>
        <Link to="/vehiculos" className="hover:bg-gray-700 p-2 rounded">
          Vehículos
        </Link>
        <Link to="/pedidos" className="hover:bg-gray-700 p-2 rounded">
          Pedidos
        </Link>
      </nav>
    </div>
  );
}
