import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import styled from "styled-components";
import Swal from "sweetalert2";
import { FaArrowsAltV } from "react-icons/fa";
import { ContentAccionesTabla, usePaqueteStore, Paginacion } from "../../../index";

export function TablaPaquete({ data, setOpenRegistraPaquete, setDataSelect, setAccion }) {
  const [pagina, setPagina] = useState(1);
  const { eliminarPaquete } = usePaqueteStore();

  // Función para editar un paquete
  const editar = (data) => {
    console.log("Datos del paquete:", data.nombre);
    if (data.nombre === "Generico") {
      Swal.fire({
        icon: "error",
        title: "No se puede editar este paquete",
        text: "Este paquete no puede ser editado.",
      });
      return;
    }
    setOpenRegistraPaquete(true);
    setDataSelect(data);
    setAccion("Editar");
  };

  // Función para eliminar un paquete
  const eliminar = async (paquete) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro de eliminar este paquete?",
        text: "No podrás revertir esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      });

      if (result.isConfirmed) {
        console.log(paquete.id_paquete);
        await eliminarPaquete(paquete.id_paquete);
        Swal.fire("Eliminado!", "El paquete ha sido eliminado.", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al eliminar el paquete.", "error");
      console.error(error);
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      accessorKey: "nombre",  // Nombre del paquete
      header: "Nombre del Paquete",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "precio",  // Precio del paquete
      header: "Precio del Paquete",
      cell: (info) => <span>${info.getValue()}</span>,
    },
    {
      accessorKey: "paquete_producto",  // Acceder a 'paquete_producto'
      header: "Productos Asociados",
      cell: (info) => {
        const paqueteProductos = info.getValue();  // Obtener los productos asociados
        return (
          <td data-title="Productos Asociados" className="ContentCell">
            {Array.isArray(paqueteProductos) && paqueteProductos.length > 0 ? (
              <ul>
                {paqueteProductos.map((producto, index) => {
                  const { products, cantidad } = producto;  // Extraer el nombre del producto y cantidad
                  return (
                    <li key={index}>
                      {products.name} - {products.description} (x{cantidad})
                     </li>
                  );
                })}
              </ul>
            ) : (
              <span>No hay productos</span>
            )}
          </td>
        );
      },
    },
    {
      accessorKey: "acciones", // Acciones (editar y eliminar)
      header: "Acciones",
      enableSorting: false,
      cell: (info) => (
        <td className="ContenCell">
          <ContentAccionesTabla
            funcionEditar={() => editar(info.row.original)}
            funcionEliminar={() => eliminar(info.row.original)}
          />
        </td>
      ),
    },
  ];

  const table = useReactTable({
    data: data || [], // Aseguramos que la tabla funcione con datos vacíos.
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Container>
      <table className="responsive-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.column.columnDef.header}
                  {header.column.getCanSort() && (
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <FaArrowsAltV />
                    </span>
                  )}
                  {header.column.getIsSorted() === "asc" && " 🔼"}
                  {header.column.getIsSorted() === "desc" && " 🔽"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Paginacion
        table={table}
        irinicio={() => table.setPageIndex(0)}
        pagina={table.getState().pagination.pageIndex + 1}
        setPagina={setPagina}
        maximo={table.getPageCount()}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    th, td {
      padding: 10px;
      text-align: center;
    }

    th {
      background-color: #f2f2f2;
      color: #333;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
    }

    tr:hover {
      background-color: #c3e0ca;
    }

    td {
      color: #333;
      font-size: 14px;
    }
  }
`;
