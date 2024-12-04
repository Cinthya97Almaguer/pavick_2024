import { supabase } from "../index";
import Swal from "sweetalert2";

// Insertar un producto
export async function InsertarProductos(id,name,description,price,stock_quantity,category_id,is_active, image_id=4) {
  const { data, error } = await supabase
   .from("products")
   .insert ([{name,description,price,stock_quantity,category_id,is_active, image_id: image_id || 1 }])
   .eq("product_id", id);
  
   
   if (error) {
    console.error("Error adding products:", error);
    return { success: false, message: "Failed to add products" };
  }

  return { success: true, data }; // Return the inserted data if successful
}

// Mostrar productos
export async function MostrarProductos() {
  const { data, error } = await supabase
   .from("products")
   .select("*");

   if (error) {
    console.error("Error fetching productos:", error);
    return [];
  }

  return data;
}

// Eliminar un producto
export async function EliminarProductos(id) {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("product_id", id);

    if (error) {
      console.error("Error deleting products:", error);
      return { success: false, message: "Failed to delete products" };
    }
  
    return { success: true, data }; // Return the inserted data if successful
  }

// Editar un producto
export async function EditarProductos(id,name,description,price,stock_quantity,category_id,is_active,image_id=4) {
  const { data, error } = await supabase
    .from("products")
    .update({name,description,price,stock_quantity,category_id,is_active,image_id:4})
    .eq("product_id", id);

    if (error) {
      console.error("Error updating products:", error);
      return { success: false, message: "Failed to update products" };
    }
  
    return { success: true, data }; // Return the inserted data if successful
  }

// Buscar productos
export async function BuscarProductos(p) {
  const { data, error } = await supabase.rpc("buscarproductos", p);

  if (error) {
    console.error("Error al buscar productos:", error);
    return { success: false, message: "Error al buscar productos", data: [] };
  }

  return { success: true, data };
}
