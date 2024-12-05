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
  import { ContentAccionesTabla, useUsuariosStore, Paginacion, usePersonalStore } from "../../../index"; // Ajustar imports según tu estructura
  import { useState } from "react";
    
  export function TablaPersonal({ data, setOpenRegistrarPersonal, setDataSelect, setAccion }) 
  {
    const [pagina, setPagina] = useState(1);
    const { eliminarPersonal } = usePersonalStore(); // Ajustar según tu store
    const editar = (data) => {
      if (data.nombres === "Usuario Admin") {
        Swal.fire({
          icon: "error",
          title: "No se puede editar este usuario",
          text: "Este usuario no puede ser editado",
        });
        return;
      }
      console.log("Datos seleccionados para edición:", data); // Verificar los datos seleccionados
      setOpenRegistrarPersonal(true);
      setDataSelect(data); // Asegurarte de que contiene el ID y demás campos necesarios
      setAccion("Editar");
    };
    
    const eliminar = (p) => {
      if (p.nombre === "Usuario Admin") { // Cambia la condición según tu lógica
        Swal.fire({
          icon: "error",
          title: "No se puede eliminar este usuario",
          text: "Este usuario no puede ser eliminado",
        });
        return;
      }
      Swal.fire({
        title: "¿Estás seguro de eliminar este usuario?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Aquí llamas a la función para eliminar el usuario
          await eliminarPersonal(p);
          // Puedes agregar un mensaje de éxito
          Swal.fire('Eliminado!', 'El usuario ha sido eliminado correctamente.', 'success');
        }
      });
    };
    const columns = [
      {
        accessorKey: "nombres", 
        header: "Nombres",
        cell: (info) => <span>{info.getValue()}</span>,
      },
      {
        accessorKey: "telefono", 
        header: "Teléfono",
        cell: (info) => <span>{info.getValue() || "No disponible"}</span>,
      },
      {
        accessorKey: "correo", 
        header: "Correo",
        cell: (info) => <span>{info.getValue() || "No disponible"}</span>,
      },
      {
        accessorKey: "tipouser", 
        header: "Tipo de Usuario",
        cell: (info) => <span>{info.getValue() || "No disponible"}</span>,
      },
      {
        accessorKey: "acciones", 
        header: "",
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
      data: data || [], // Asegúrate de que siempre se pase un array, incluso si data es null
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
                    { {
                      asc: "🔼",
                      desc: " 🔽"
                    }[header.column.getIsSorted()]}
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
    width: 100%; /* Ocupa todo el ancho del contenedor principal */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    overflow-x: auto; /* Permite desplazamiento horizontal en caso de tablas grandes */
    table {
      width: 100%; /* La tabla ocupa todo el ancho disponible */
      border-collapse: collapse;
      font-family: Arial, sans-serif;
      th,
      td {
        padding: 10px;
        text-align: center;
      }
      th {
        background-color: #f2f2f2; /* Color del encabezado */
        color: #050505;
        font-weight: bold;
        border-bottom: 1px solid #050505;
      }
      tr:hover {
        background-color: #c3e0ca; /* Color al pasar el mouse */
      }
      td {
        color: #333;
        font-size: 14px;
        &.ContenCell {
          text-align: center;
        }
      }
    }
  `;