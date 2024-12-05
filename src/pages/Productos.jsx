import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ProductosTemplate,
  SpinnerLoader,
  useProductosStore,
} from "../index";

export function Productos() {
  const { mostrarproductos, buscarproductos, buscador, dataproductos } = useProductosStore();

  // Cargar todos los productos
  const { isLoading: isLoadingProductos, error: errorProductos, data: dataProductos } = useQuery({
    queryKey: ["mostrar productos"],
    queryFn: mostrarproductos,
  });

  // Buscar productos específicos con el valor de `buscador`
  const { mutate: buscarProductosMutate, data: buscardata, isLoading: isLoadingBuscar } = useMutation({
    mutationFn: buscarproductos,
  });

  // Ejecutar la búsqueda automáticamente cuando `buscador` cambie
  /* React.useEffect(() => {
    if (buscador.trim() !== "") {
      buscarProductosMutate({ descripcion: buscador });
    }
  }, [buscador, buscarProductosMutate]);*/

  // Mostrar un loader si los datos están cargando
  if (isLoadingProductos) {
    return <SpinnerLoader message="Cargando productos..." />;
  }

  if (isLoadingBuscar) {
    return <SpinnerLoader message="Buscando productos..." />;
  }

  // Manejar errores de consulta
  if (errorProductos) {
    console.error("Error al cargar productos:", errorProductos);
    return <span>Error al cargar productos</span>;
  }

  // Seleccionar los datos a mostrar: resultados de la búsqueda o productos generales
  const productosData = buscardata || dataProductos || dataproductos;

  // Verificar si hay productos para mostrar
  if (!productosData || productosData.length === 0) {
    return <span>No se encontraron productos</span>;
  }

  // Pasar datos a la plantilla
  return <ProductosTemplate data={productosData} />;
}
