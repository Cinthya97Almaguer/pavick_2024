import { create } from "zustand";
import {
  BuscarPaquete,
  MostrarPaquete,
  MostrarTodosPaquetes,
  EliminarPaquete,
  InsertarPaquete,
  EditarPaquete,
} from "../index";

export const usePaqueteStore = create((set, get) => ({
  buscador: "",
  datapaquete: [], // Lista de todos los paquetes
  isLoading: false, // Indicador de carga

  // Setear término de búsqueda
  setBuscador: (nuevoBuscador) => set({ buscador: nuevoBuscador }),

  // Mostrar todos los paquetes
  mostrarTodosPaquetes: async () => {
    try {
      const response = await MostrarTodosPaquetes();
      set({ datapaquete: response });
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error al mostrar todos los paquetes:", error);
      throw error;
    }
  },

  InsertarPaquete: async (paquete, productos) => {
    set({ isLoading: true }); 
    try {
      const response = await InsertarPaquete(paquete, productos);
      if (response) {
        const todosPaquetes = await MostrarTodosPaquetes();
        set({ datapaquete: todosPaquetes });
      }
      console.log(productos);

      window.location.reload();
      return { success: !!response };
    } catch (error) {
      console.error("Error al insertar paquete:", error);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false }); 
    }
  },

  // Buscar un paquete por nombre
  buscarPaquete: async ({ nombre }) => {
    try {
      const response = await BuscarPaquete({ nombre });
      set({ datapaquete: response });
      return response;
    } catch (error) {
      console.error("Error al buscar paquete:", error);
      throw error;
    }
  },

  // Eliminar un paquete por ID
  eliminarPaquete: async (id_paquete) => {
    set({ isLoading: true }); // Activar indicador de carga
    try {
      if (!id_paquete) {
        throw new Error("ID de paquete no válido para eliminar.");
      }

      await EliminarPaquete({ id_paquete }); // Llamada al backend para eliminar
      const nuevaLista = get().datapaquete.filter((p) => p.id_paquete !== id_paquete);
      set({ datapaquete: nuevaLista }); // Actualizar la lista de paquetes

      return { success: true };
    } catch (error) {
      console.error("Error al eliminar paquete:", error);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false }); // Desactivar indicador de carga
    }
  },

  // Editar un paquete con sus productos asociados
  editarPaquete: async (p, paquete, productos) => {
    set({ isLoading: true }); // Activar indicador de carga
    console.log("ID del paquete a editar: " + p.id_paque);
    console.log("Editar un paquete con sus productos: " + JSON.stringify(productos, null, 2));
    try {
      if (!p || !paquete ) {
        throw new Error("Datos inválidos para editar paquete.");
      }

      const payload = { ...paquete, productos };
      console.log("Payload: " + payload.nombre + payload.precio);
      await EditarPaquete(payload, p, productos); // Llamada al backend para editar

      // Actualizar el paquete en la lista local
      const nuevaLista = get().datapaquete.map((p) =>
        p.id_paquete === p.id_paquete ? { ...p, ...paquete, productos } : p
      );
      set({ datapaquete: nuevaLista });
      window.location.reload();
      return { success: true };
    } catch (error) {
      console.error("Error al editar paquete:", error);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false }); // Desactivar indicador de carga
    }
  },
}));
