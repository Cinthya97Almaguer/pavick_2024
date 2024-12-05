import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PaqueteTemplate, SpinnerLoader, usePaqueteStore } from "../index";

export function Paquetes() {
  const { mostrarTodosPaquetes, buscarPaquete, buscador, datapaquete } = usePaqueteStore();

  // Cargar todos los paquetes
  const { isLoading: isLoadingPaquetes, error: errorPaquetes, data: dataPaquetes } = useQuery({
    queryKey: ["mostrar todos paquetes"],
    queryFn: mostrarTodosPaquetes,
    enabled: true,
  });

  // Buscar paquetes específicos con el valor de `buscador`
  const { mutate: buscarPaqueteMutate, data: buscardata, isLoading: isLoadingBuscar } = useMutation({
    mutationFn: buscarPaquete,
  });

  // Ejecutar búsqueda automáticamente cuando `buscador` cambie
  React.useEffect(() => {
    if (buscador.trim() !== "") {
      buscarPaqueteMutate({ nombre: buscador });
    }
  }, [buscador, buscarPaqueteMutate]);

  // Mostrar loader si los datos están cargando
  if (isLoadingPaquetes || isLoadingBuscar) {
    return <SpinnerLoader message="Cargando datos..." />;
  }

  // Manejar errores de consulta
  if (errorPaquetes) {
    console.error("Error al cargar paquetes:", errorPaquetes);
    return <span>Error al cargar paquetes. Intenta nuevamente.</span>;
  }

  // Seleccionar datos a mostrar: resultados de búsqueda o todos los paquetes
  const paqueteData = buscardata || dataPaquetes || datapaquete;

  // Verificar si hay paquetes para mostrar
  if (!paqueteData || paqueteData.length === 0) {
    return <span>No se encontraron paquetes</span>;
  }

  // Renderizar plantilla con los datos
  return <PaqueteTemplate data={paqueteData} />;
}
