export default function Home() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard del Sistema DMS</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Ventas del mes</h2>
          <p className="text-3xl font-bold text-green-600">$1.220.000</p>
          <p className="text-sm text-gray-500">+15% respecto al mes anterior</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Stock bajo</h2>
          <ul className="text-sm text-red-600 list-disc list-inside">
            <li>Pata lateral XR150</li>
            <li>Pastilla freno trasera Tornado</li>
            <li>Filtro aceite CG150</li>
          </ul>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Facturas a vencer</h2>
          <p className="text-sm text-gray-800">12 facturas por $876.300</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Gráfico de ventas por categoría</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">[Gráfico falso aquí]</div>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Comparativa de ingresos</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">[Gráfico falso aquí]</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-xl font-bold text-gray-700">25</h3>
          <p className="text-sm text-gray-500">Repuestos vendidos hoy</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-xl font-bold text-gray-700">8</h3>
          <p className="text-sm text-gray-500">Encargos pendientes</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-xl font-bold text-gray-700">$532.000</h3>
          <p className="text-sm text-gray-500">Ingresos por repuestos</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-xl font-bold text-gray-700">92%</h3>
          <p className="text-sm text-gray-500">Índice de satisfacción</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="bg-blue-600 text-white py-3 px-6 rounded shadow hover:bg-blue-700">Análisis de ventas</button>
        <button className="bg-green-600 text-white py-3 px-6 rounded shadow hover:bg-green-700">Alertas de stock</button>
        <button className="bg-yellow-500 text-white py-3 px-6 rounded shadow hover:bg-yellow-600">Gestión de vencimientos</button>
        <button className="bg-gray-700 text-white py-3 px-6 rounded shadow hover:bg-gray-800">Ver desempeño mensual</button>
      </div>
    </div>
  );
}
