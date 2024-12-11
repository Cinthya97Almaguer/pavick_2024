import { supabase } from "../index";
import Swal from "sweetalert2";

// Insertar un cliente
export async function InsertarCliente(cliente) {
  if (!cliente?.username || !cliente?.email || !cliente?.password_hash) {
    Swal.fire({
      icon: "error",
      title: "Faltan datos",
      text: "Debe proporcionar un nombre de usuario, email y contraseña.",
    });
    return null;
  }

  const { data, error } = await supabase
    .from("client")
    .insert({
      username: cliente.username,
      email: cliente.email,
      password_hash: cliente.password_hash,
      first_name: cliente.first_name || null,
      last_name: cliente.last_name || null,
      phone: cliente.phone || null,
      is_active: cliente.is_active || true,
    });

  if (error) {
    console.error("Error al insertar cliente:", error.message);
    Swal.fire({
      icon: "error",
      title: "Error al insertar cliente",
      text: error.message,
    });
    return null;
  }

  return data;
}

// Mostrar los detalles de un cliente
export async function MostrarCliente(cliente) {
  const { data, error } = await supabase
    .from("client")
    .select("*")
    .eq("id_client", cliente.id_client);

  if (error) {
    console.error("Error al mostrar cliente:", error.message);
    return null;
  }

  return data;
}

// Mostrar todos los clientes
export async function MostrarTodosClientes() {
  const { data, error } = await supabase
    .from("client")
    .select("*");

  if (error) {
    console.error("Error al mostrar clientes:", error.message);
    return [];
  }

  return data;
}

// Eliminar un cliente
export async function EliminarCliente(cliente) {
  const { error } = await supabase
    .from("client")
    .delete()
    .eq("id_client", cliente.id_client);

  if (error) {
    console.error("Error al eliminar cliente:", error.message);
    Swal.fire({
      icon: "error",
      title: "Error al eliminar cliente",
      text: error.message,
    });
    return null;
  }

  return true;
}

// Editar un cliente
export async function EditarCliente(cliente) {
  const { error } = await supabase
    .from("client")
    .update({
      username: cliente.username,
      email: cliente.email,
      password_hash: cliente.password_hash,
      first_name: cliente.first_name,
      last_name: cliente.last_name,
      phone: cliente.phone,
      is_active: cliente.is_active,
    })
    .eq("id_client", cliente.id_client);

  if (error) {
    console.error("Error al editar cliente:", error.message);
    Swal.fire({
      icon: "error",
      title: "Error al editar cliente",
      text: error.message,
    });
    return null;
  }

  return true;
}

// Buscar cliente por nombre de usuario
export async function BuscarCliente(cliente) {
  const { data, error } = await supabase
    .from("client")
    .select("*")
    .ilike("username", `%${cliente.username}%`);

  if (error) {
    console.error("Error al buscar cliente:", error.message);
    return null;
  }

  return data;
}
