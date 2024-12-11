import React, { useState } from "react";
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
import { ContentAccionesTabla, Paginacion, useClientesStore } from "../../../index";

export function TablaClientes({ data, setOpenRegistrarCliente, setDataSelect, setAccion }) {
  const [pagina, setPagina] = useState(1);
  const { eliminarCliente } = useClientesStore();

  // Función para editar un cliente
  const editar = (data) => {
    setOpenRegistrarCliente(true);
    setDataSelect(data);
    setAccion("Editar");
  };

  // Función para eliminar un cliente
  const eliminar = async (cliente) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro de eliminar este cliente?",
        text: "No podrás revertir esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      });

      if (result.isConfirmed) {
        await eliminarCliente(cliente.id_client);
        Swal.fire("Eliminado!", "El cliente ha sido eliminado.", "success");
      }
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al eliminar el cliente.", "error");
      console.error(error);
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      accessorKey: "username",
      header: "Nombre de Usuario",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "email",
      header: "Correo Electrónico",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "first_name",
      header: "Nombre",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "last_name",
      header: "Apellido",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "is_active",
      header: "Estado",
      cell: (info) => (
        <span>{info.getValue() ? "Activo" : "Inactivo"}</span>
      ),
    },
    {
      accessorKey: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: (info) => (
        <ContentAccionesTabla
          funcionEditar={() => editar(info.row.original)}
          funcionEliminar={() => eliminar(info.row.original)}
        />
      ),
      
    },
  ];

  const table = useReactTable({
    data: data || [],
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
