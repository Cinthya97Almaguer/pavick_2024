import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ClientesTemplate, SpinnerLoader, useClientesStore } from "../index";

export function Clientes() {
  const { mostrarTodosClientes, buscarCliente, buscador, dataCliente } = useClientesStore();

  // Cargar todos los clientes
  const { isLoading: isLoadingClientes, error: errorClientes, data: dataClientes } = useQuery({
    queryKey: ["mostrar todos clientes"],
    queryFn: mostrarTodosClientes,
    enabled: true,
  });

  // Buscar clientes específicos con el valor de `buscador`
  const { mutate: buscarClienteMutate, data: buscardata, isLoading: isLoadingBuscar } = useMutation({
    mutationFn: buscarCliente,
  });

  // Ejecutar búsqueda automáticamente cuando `buscador` cambie
  React.useEffect(() => {
    if (buscador.trim() !== "") {
      buscarClienteMutate({ nombre: buscador });
    }
  }, [buscador, buscarClienteMutate]);

  // Mostrar loader si los datos están cargando
  if (isLoadingClientes || isLoadingBuscar) {
    return <SpinnerLoader message="Cargando clientes..." />;
  }

  // Manejar errores de consulta
  if (errorClientes) {
    console.error("Error al cargar clientes:", errorClientes);
    return <span>Error al cargar clientes. Intenta nuevamente.</span>;
  }

  // Seleccionar datos a mostrar: resultados de búsqueda o todos los clientes
  const clienteData = buscardata || dataClientes || dataCliente;

  // Verificar si hay clientes para mostrar
  if (!clienteData || clienteData.length === 0) {
    return <span>No se encontraron clientes</span>;
  }

  // Renderizar plantilla con los datos
  return <ClientesTemplate data={clienteData} />;
}
