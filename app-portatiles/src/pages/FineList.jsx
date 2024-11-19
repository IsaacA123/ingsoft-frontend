import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { format, isPast } from "date-fns";
import { es } from "date-fns/locale";

const apiUrl = import.meta.env.VITE_API_URL;

const FinesList = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFines = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No estás autenticado. Por favor inicia sesión.");
        return;
      }

      const response = await fetch(`${apiUrl}/fines`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setFines(data.data);
      } else {
        console.error("Error obteniendo las multas", data);
        toast.error(data.message || "Error al obtener las multas.");
        setErrorMessage(data.message);
      }
    } catch (error) {
      toast.error("Error de conexión", { autoClose: 5000 });
      setErrorMessage("Error de conexión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFines = fines.some(fine => !isPast(new Date(fine.end_date)));
  
  useEffect(() => {
    fetchFines();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {hasActiveFines && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Tienes multas activas. No podrás realizar reservas de portátiles hasta que estas expiren.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="sm:flex sm:items-center p-6 bg-gray-50">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Mis Multas</h1>
            <p className="mt-2 text-sm text-gray-700">
              Lista de todas tus multas y sus fechas de expiración.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Finalización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fines.map((fine) => {
                const isExpired = isPast(new Date(fine.end_date));
                return (
                  <tr 
                    key={fine.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fine.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {fine.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(fine.end_date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isExpired
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isExpired ? "Expirada" : "Activa"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {fines.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes multas</h3>
            <p className="mt-1 text-sm text-gray-500">¡Excelente! Mantén el buen comportamiento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinesList;