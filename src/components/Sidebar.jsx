import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-48 h-screen bg-gray-800 text-white p-4">
      <h1 className="text-lg font-bold mb-6">Menú</h1>
      <ul className="space-y-4">
        <li><Link to="/repuestos" className="hover:text-yellow-300">Repuestos</Link></li>
        <Link to="/repuestos/cargar" className="hover:bg-gray-700 p-2 rounded"> Cargar Repuesto </Link>
      </ul>
    </div>
  );
}
