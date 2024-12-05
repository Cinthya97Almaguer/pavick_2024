import { create } from "zustand";
import {
  MostrarProductos,
  InsertarProductos,
  EditarProductos,
  EliminarProductos,
  BuscarProductos,
  BuscarProductosPorID,
  MostrarPaquetesConProductos,
} from "../index";

export const useProductosStore = create((set, get) => ({
  // Estado inicial
  buscador: "",
  dataproductos: [],
  productosItemSelect: null, // Mejor opción para manejar un solo producto seleccionado
  parametros: {},

  // Actualizar el buscador
  setBuscador: (p) => {
    set({ buscador: p });
  },

  // Mostrar productos
  mostrarproductos: async () => {
    try {
      console.log("Mostrando productos...");
      const response = await MostrarProductos();

      set({
        dataproductos: response, // Actualizar la lista de productos
        productosItemSelect: response.length > 0 ? response[0] : null, // Seleccionar el primer producto si hay resultados
      });

      console.log("Productos obtenidos:", response);
      return response;
    } catch (error) {
      console.error("Error al mostrar productos:", error);
      throw new Error("No se pudieron obtener los productos.");
    }
  },

  // Insertar un nuevo producto
  insertarproductos: async (id,name,description,price,stock_quantity,category_id,is_active) => {
    try {
      const result = await InsertarProductos(id,name,description,price,stock_quantity,category_id,is_active);

      if (result.success) {
        window.location.reload();
        console.log("Producto añadida exitosamente:", result.data);
        return result.data; // Return the added producto
      } else {
        console.error("Error al agregar producto:", result.message);
        return null;
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw new Error("No se pudo agregar la producto.");
    }
  },

  // Eliminar un producto
  eliminarproductos: async (data) => {
    console.log("Eliminar un producto: ", data.id);
    try {
      const result = await EliminarProductos(data.id);

      if (result.success) {
        window.location.reload();
        console.log("Producto eliminado exitosamente:", result.data);
        return result.data; // Return the deleted category
      } else {
        console.error("Error al eliminar producto:", result.message);
        return null;
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw new Error("No se pudo eliminar la producto.");
    }
  },

  // Editar un producto existente
  editarproductos: async (id,name,description,price,stock_quantity,category_id,is_active) => {
    try {
      const result = await EditarProductos(id,name,description,price,stock_quantity,category_id,is_active);

      if (result.success) {
        window.location.reload();
        console.log("Producto editada exitosamente:", result.data);
        return result.data; // Return the updated category
      } else {
        console.error("Error al editar producto:", result.message);
        return null;
      }
    } catch (error) {
      console.error("Error al editar producto:", error);
      throw new Error("No se pudo editar la producto.");
    }
  },

  // Buscar productos específicos
  buscarproductos: async (filtros) => {
    try {
      console.log("Buscando productos con filtros:", filtros);
      const response = await BuscarProductos(filtros);

      set({
        dataproductos: response,
      });

      console.log("Productos encontrados:", response);
      return response;
    } catch (error) {
      console.error("Error al buscar productos:", error);
      throw new Error("No se pudieron buscar los productos.");
    }
  },


  buscarproductosPorID: async (id) => {
    try {
      console.log("Buscando productos con id:", id.id_paquete);
      const response = await BuscarProductosPorID(id);

      set({
        dataproductos: response,
      });

      console.log("Productos encontrados:", response);
      return response;
    } catch (error) {
      console.error("Error al buscar productos:", error);
      throw new Error("No se pudieron buscar los productos.");
    }
  },

  datapaquetes: [],
  mostrarTodosPaquetes: async () => {
      try {
          const paquetes = await MostrarPaquetesConProductos();
          set({ datapaquetes: paquetes });
          console.log("Paquetes with products:", paquetes);
      } catch (error) {
          console.error("Error fetching paquetes:", error);
      }
  },

}));
