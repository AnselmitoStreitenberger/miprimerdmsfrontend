import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Repuestos from "./pages/Repuestos";
import RepuestosForm from "./pages/RepuestosForm";
import Vehiculos from "./pages/Vehiculos";
import Pedidos from "./pages/Pedidos";
import Clientes from "./pages/Clientes";
import Presupuestos from "./pages/Presupuestos";
import Pedidos_Clientes from "./pages/Pedidos_Clientes";
import Crear_Pedidos from "./pages/Crear_Pedidos";

export default function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/repuestos" element={<Repuestos />} />
          <Route path="/repuestos/cargar" element={<RepuestosForm />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/pedidos_clientes" element={<Pedidos_Clientes/>} />
          <Route path="/crear_pedidos" element={<Crear_Pedidos/>} />
        </Routes>
      </div>
    </div>
  );
}