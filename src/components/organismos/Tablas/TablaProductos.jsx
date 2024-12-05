import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import styled from "styled-components";
import {
  ContentAccionesTabla,
  Paginacion,
  useProductosStore,
  Colorcontent,
  v,
} from "../../../index";
import Swal from "sweetalert2";
import { FaArrowsAltV } from "react-icons/fa";

export function TablaProductos({
  data,
  SetopenRegistro,
  setdataSelect,
  setAccion,
}) {
  const [pagina, setPagina] = useState(1);
  const { eliminarproductos } = useProductosStore();

  const [updateFlag, setUpdateFlag] = useState(false);

  const editar = (data) => {
    if (data.descripcion === "General") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Este registro no se permite modificar ya que es valor por defecto.",
      });
      return;
    }
    SetopenRegistro(true);
    setdataSelect(data);
    setAccion("Editar");
  };

  const eliminar = (p) => {
    if (p.descripcion === "Genérico") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Este registro no se puede eliminar ya que es un valor por defecto.",
      });
      return;
    }
    Swal.fire({
      title: "¿Estás seguro(a)(e)?",
      text: "Una vez eliminado, ¡no podrá recuperar este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await eliminarproductos({ id: p.product_id });
      }
    });
  };

  const handleEditar = (row) => {
    editar(row); // Call the original editar function
    setUpdateFlag((prev) => !prev); // Trigger re-evaluation of useMemo
  };

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "ID",
      cell: (info) => (
        <td data-title="Nombre" className="ContentCell">
          <span>{info.getValue()}</span>
        </td>
      ),
    },
    {
      accessorKey: "description",
      header: "Nombre",
      cell: (info) => (
        <td data-title="Descripción" className="ContentCell">
          <span>{info.getValue()}</span>
        </td>
      ),
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: (info) => (
        <td data-title="Precio" className="ContentCell">
          <span>${info.getValue()}</span>
        </td>
      ),
    },
    {
      accessorKey: "stock_quantity",
      header: "Stock",
      cell: (info) => (
        <td data-title="Stock" className="ContentCell">
          <span>{info.getValue()}</span>
        </td>
      ),
    },
    {
      accessorKey: "category_id",
      header: "Categoria",
      cell: (info) => (
        <td data-title="Categoria" className="ContentCell">
          <span>{info.getValue()}</span>
        </td>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Activo",
      cell: (info) => (
        <td data-title="Activo" className="ContentCell">
          <span>{info.getValue() ? "Sí" : "No"}</span>
        </td>
      ),
    },
    {
      accessorKey: "acciones",
      header: "",
      enableSorting: false,
      cell: (info) => (
        <td className="ContentCell">
          <ContentAccionesTabla
            funcionEditar={() => editar(info.row.original)}
            funcionEliminar={() => eliminar(info.row.original)}
          />
        </td>
      ),
    },
  ], [updateFlag]);

  const table = useReactTable({
    data,
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
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()]}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((item) => (
            <tr key={item.id}>
              {item.getVisibleCells().map((cell) => (
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
