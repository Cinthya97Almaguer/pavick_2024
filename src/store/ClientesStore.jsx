import { create } from "zustand";
import {
  BuscarCliente,
  MostrarCliente,
  MostrarTodosClientes,
  EliminarCliente,
  InsertarCliente,
  EditarCliente,
} from "../index";

export const useClientesStore = create((set, get) => ({
  buscador: "",
  dataCliente: [], // Lista de todos los clientes
  isLoading: false, // Indicador de carga

  // Setear término de búsqueda
  setBuscador: (nuevoBuscador) => set({ buscador: nuevoBuscador }),

  // Mostrar todos los clientes
  mostrarTodosClientes: async () => {
    try {
      const response = await MostrarTodosClientes();
      set({ dataCliente: response });
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error al mostrar todos los clientes:", error);
      throw error;
    }
  },

  // Insertar un cliente
  insertarCliente: async (cliente) => {
    set({ isLoading: true });
    try {
      const response = await InsertarCliente(cliente);
      if (response) {
        const todosClientes = await MostrarTodosClientes();
        set({ dataCliente: todosClientes });
      }
      console.log(cliente);
      return { success: !!response };
    } catch (error) {
      console.error("Error al insertar cliente:", error);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Buscar un cliente por nombre de usuario
  buscarCliente: async ({ username }) => {
    try {
      const response = await BuscarCliente({ username });
      set({ dataCliente: response });
      return response;
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      throw error;
    }
  },

  // Eliminar un cliente por ID
  eliminarCliente: async (id_client) => {
    set({ isLoading: true });
    try {
      if (!id_client) {
        throw new Error("ID de cliente no válido para eliminar.");
      }

      await EliminarCliente({ id_client });
      const nuevaLista = get().dataCliente.filter((c) => c.id_client !== id_client);
      set({ dataCliente: nuevaLista });

      return { success: true };
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  // Editar un cliente
  editarCliente: async (cliente) => {
    set({ isLoading: true });
    try {
      if (!cliente || !cliente.id_client) {
        throw new Error("Datos inválidos para editar cliente.");
      }

      const response = await EditarCliente(cliente); // Asumimos que EditarCliente recibe un objeto cliente
      if (response) {
        const nuevaLista = get().dataCliente.map((c) =>
          c.id_client === cliente.id_client ? { ...c, ...cliente } : c
        );
        set({ dataCliente: nuevaLista });
      }
      return { success: true };
    } catch (error) {
      console.error("Error al editar cliente:", error);
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },
}));
