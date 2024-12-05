import { create } from "zustand";
import { MostrarPersonal, InsertarPesonal, EliminarPersonal, EditarPersonal, BuscarPersonal } from "../index"; // Asegúrate de importar las funciones correctamente
import Swal from "sweetalert2";
import { supabase } from "../index"; // Asegúrate de que la importación de Supabase sea correcta

export const usePersonalStore = create((set, get) => ({
  buscador: "", // Para buscar personal
  setBuscador: (p) => {
    set({ buscador: p }); // Establece el valor del buscador
  },
  datapersona: [], // Almacena los datos del personal
  personalItemSelect: [], // Almacena el personal seleccionado
  parametro: {}, // Parámetros para la consulta

  // Función para mostrar el personal
  mostrarPersonal: async (p) => {
    try {
      const response = await MostrarPersonal(p);
      if (response && response.length > 0) {
        set({ parametro: p }); // Actualiza los parámetros
        set({ datapersona: response }); // Actualiza la lista de personal
        set({ personalItemSelect: response[0] }); // Selecciona el primer elemento
      } else {
        console.warn("No se encontró ningún personal");
        set({ datapersona: [] });
      }
    } catch (error) {
      console.error("Error al obtener los datos del personal:", error);
      set({ datapersona: [] });
    }
  },

  // Función para seleccionar un ítem de personal
  selectPersonal: (p) => {
    set({ personalItemSelect: p });
  },

  // Función para insertar personal
  insertarPersonal: async (p) => {
    const direccionPorDefecto = p.direccion || "Dirección no proporcionada";
    const { data, error } = await supabase
      .from("usuarios") // Cambiar "usuarios" por la tabla correspondiente
      .insert({
        ...p,
        direccion: direccionPorDefecto,
      })
      .select()
      .maybeSingle();

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al insertar personal: " + error.message,
      });
    }
    if (data) {
      const { mostrarPersonal } = get();
      const { parametro } = get();
      mostrarPersonal(parametro); // Actualiza la lista después de insertar
      return data;
    }
  },

  // Función para eliminar personal
  eliminarPersonal: async (p) => {
    await EliminarPersonal(p);
    const { mostrarPersonal } = get();
    const { parametro } = get();
    mostrarPersonal(parametro); // Actualiza la lista después de eliminar
  },

  // Función para editar personal
  editarPersonal: async (p) => {
    console.log("Datos de personal a editar:", p);
  
    // Obtener el ID del registro a editar
    const idToEdit = p.id;
    if (!idToEdit) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El ID del personal es necesario para editar.",
      });
      console.log("Datos recibidos para edición:", p);
      return;
    }
  
    // Limpiar los datos antes de enviarlos a Supabase
    const datosEditados = {
      ...p,
      direccion: p.direccion || "-", // Asegurarse de no enviar campos nulos
    };
  
    console.log("ID a editar:", idToEdit);
    console.log("Datos enviados para edición:", datosEditados);
  
    const { data, error } = await supabase
      .from("usuarios")
      .update(datosEditados)
      .match({ id: idToEdit })
      .select()
      .maybeSingle();
  
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al editar personal: " + error.message,
      });
      return;
    }
  
    if (data) {
      console.log("Datos actualizados:", data);
      const { mostrarPersonal } = get();
      const { parametro } = get();
      mostrarPersonal(parametro); // Actualiza la lista después de editar
      return data;
    }
  },
  

  // Función para buscar personal
  buscarPersonal: async (p) => {
    const response = await BuscarPersonal(p);
    set({ datapersona: response });
  },
}));
