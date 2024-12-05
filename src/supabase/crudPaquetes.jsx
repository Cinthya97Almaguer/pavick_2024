import { supabase, BuscarProductosPorID } from "../index";
import Swal from "sweetalert2";

// Insertar un paquete completo con los productos asociados
export async function InsertarPaquete(paquete, productos) {
    // Validar los campos requeridos
    //productos = productos.data;
    console.log("Productos a insertar: "+JSON.stringify(productos, null, 2));

    if (!paquete?.nombre || !paquete?.precio) {
        Swal.fire({
            icon: "error",
            title: "Faltan datos",
            text: "Debe proporcionar un nombre y un precio para el paquete.",
        });
        return null;
    }
    // Insertar el paquete en la tabla 'paquetes'
    const { data, error: errorPaquete } = await supabase
        .from("paquetes")
        .insert({ nombre: paquete.nombre, precio: paquete.precio })
        .select("id_paquete");

    console.log("Respuesta al insertar paquete:", data, errorPaquete);


    const idPaquete = data[0].id_paquete; // Obtener el ID del paquete insertado
    console.log(idPaquete);

    const productosInsertar = productos.map(producto => ({
        id_paquete: idPaquete,
        id_producto: producto.producto_id, // Asegúrate de que cada producto tiene un campo 'id'
        cantidad: producto.cantidad, // Si es necesario, puedes incluir otros campos
    }));

    const { data: productosData, error: errorProductos } = await supabase
        .from("paquete_producto")
        .insert(productosInsertar);

    console.log("Respuesta al insertar productos:", productosData, errorProductos);

    // Manejar errores al insertar el paquete
    if (errorPaquete || !data || data.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Error al insertar el paquete",
            text: errorPaquete?.message || "No se pudo insertar el paquete.",
        });
        return null;
    }
    return true;
}


// Mostrar los detalles de un paquete
export async function MostrarPaquete(p) {
    console.log("Ejecutando MostrarPaquete con", p);
    const { data, error } = await supabase
        .from("paquete_producto")
        .select(`
            id_paquete,
            cantidad,
            paquetes (id_paquete, nombre, precio),
            products (name)
        `)
        .eq("id_paquete", p.id_paquete);

    if (error) {
        console.error("Error al consultar los datos:", error);
        return null;
    }
    console.log("Datos de paquete:", data);
    return data;
}

// Mostrar todos los paquetes
export async function MostrarTodosPaquetes() {
    const { data, error } = await supabase
        .from("paquetes")
        .select(`
            id_paquete,
            nombre,
            precio,
            paquete_producto (cantidad, products (name))
        `);

    if (error) {
        console.error("Error:", error);
        return [];
    }
    return data;
}

// Eliminar un paquete y sus productos relacionados
export async function EliminarPaquete(p) {
    console.log("Ejecutando EliminarPaquete con ID: ", p.id_paquete);
    const { error: errorRelacionados } = await supabase
        .from("paquete_producto")
        .delete()
        .eq("id_paquete", p.id_paquete);

    if (errorRelacionados) {
        console.error("Error al eliminar los registros relacionados:", errorRelacionados.message);
        alert(`Error al eliminar los registros relacionados: ${errorRelacionados.message}`);
        return null;
    }

    const { error } = await supabase
        .from("paquetes")
        .delete()
        .eq("id_paquete", p.id_paquete);

    if (error) {
        console.error("Error al eliminar el paquete:", error.message);
        alert(`Error al eliminar el paquete: ${error.message}`);
        return null;
    } else {
        window.location.reload();
        return true;
    }
}

// Editar los detalles de un paquete o productos asociados
export async function EditarPaquete(p, paquete, productos) {
    var productos_anteriores = await BuscarProductosPorID(paquete.id_paquete);

    console.log("Productos anteriores: "+JSON.stringify(productos_anteriores.data, null, 2));
    console.log("Productos nuevos: "+JSON.stringify(productos, null, 2));

    const { error: errorPaquete } = await supabase
        .from("paquetes")
        .update({
            nombre: p.nombre,
            precio: p.precio
        })
        .eq("id_paquete", paquete.id_paquete);

    if (errorPaquete) {
        console.error("Error al editar el paquete:", errorPaquete.message);
        alert(`Error al editar el paquete: ${errorPaquete.message}`);
        return null;
    }
    // Create maps for easier comparison
    const anterioresMap = new Map(
        productos_anteriores.data.map((pa) => [pa.id_producto, pa.cantidad])
    );
    const nuevosMap = new Map(
        productos.map((pn) => [parseInt(pn.producto_id), pn.cantidad])
    );

    // Process updates and removals
    for (const [id_producto, cantidad_anterior] of anterioresMap.entries()) {
        if (nuevosMap.has(id_producto)) {
            const nuevaCantidad = nuevosMap.get(id_producto);
            if (nuevaCantidad !== cantidad_anterior) {
                // Update quantity
                const { error: errorCantidad } = await supabase
                    .from("paquete_producto")
                    .update({ cantidad: nuevaCantidad })
                    .eq("id_paquete", paquete.id_paquete)
                    .eq("id_producto", id_producto);

                if (errorCantidad) {
                    console.error("Error al actualizar la cantidad del producto:", errorCantidad.message);
                    alert(`Error al actualizar la cantidad del producto: ${errorCantidad.message}`);
                    return null;
                }
            }
            // Remove from nuevosMap as it is already processed
            nuevosMap.delete(id_producto);
        } else {
            // Remove product
            const { error: errorEliminar } = await supabase
                .from("paquete_producto")
                .delete()
                .eq("id_paquete", paquete.id_paquete)
                .eq("id_producto", id_producto);

            if (errorEliminar) {
                console.error("Error al eliminar el producto:", errorEliminar.message);
                alert(`Error al eliminar el producto: ${errorEliminar.message}`);
                return null;
            }
        }
    }

    // Process additions
    for (const [id_producto, nuevaCantidad] of nuevosMap.entries()) {
        const { error: errorInsertar } = await supabase
            .from("paquete_producto")
            .insert([
                { id_paquete: paquete.id_paquete, id_producto, cantidad: nuevaCantidad }
            ]);

        if (errorInsertar) {
            console.error("Error al insertar el nuevo producto:", errorInsertar.message);
            alert(`Error al insertar el nuevo producto: ${errorInsertar.message}`);
            return null;
        }
    }

    return true;
}

// Buscar paquetes por nombre
export async function BuscarPaquete(p) {
    const { data, error } = await supabase
        .from("paquetes")
        .select()
        .ilike("nombre", `%${p.nombre}%`);

    if (error) {
        console.error("Error al buscar el paquete:", error.message);
        return null;
    }
    return data;
}


export async function MostrarPaquetesConProductos() {
    const { data, error } = await supabase
        .from('paquetes')
        .select(`
            *,
            paquete_producto (*)
        `);

    if (error) {
        console.error("Error fetching paquetes and products:", error);
        return [];
    }
    console.log("Datos de los paquetes: " + data);
    return data;
}

