import { useState } from "react";
import {
  BtnFiltro,
  ContentFiltro,
  Header,
  Title,
  TablaClientes,
  Buscador,
  useClientesStore,
  RegistrarClientes,
  v,
} from "../../index";
import styled from "styled-components";

export function ClientesTemplate({ data }) {
  const [state, setState] = useState(false);
  const [dataSelect, setDataSelect] = useState({});
  const [accion, setAccion] = useState("");
  const [openRegistrarCliente, setOpenRegistrarCliente] = useState(false);

  // Función para abrir el formulario de nuevo cliente
  const nuevoRegistro = () => {
    setOpenRegistrarCliente(!openRegistrarCliente);
    setAccion("Nuevo");
    setDataSelect({});
  };

  const { setBuscador } = useClientesStore(); // Utilizar el estado global para manejar la búsqueda

  return (
    <Containeir>
      {openRegistrarCliente && (
        <RegistrarClientes
          dataSelect={dataSelect} // Datos del cliente seleccionado
          accion={accion} // Acción a realizar (Nuevo o Editar)
          onClose={() => setOpenRegistrarCliente(!openRegistrarCliente)} // Cerrar modal
        />
      )}

      <header className="header">
        <Header stateConfig={{ state: state, setState: () => setState(!state) }} />
      </header>

      <section className="area1">
        <ContentFiltro>
          <Title>Clientes</Title>
          <BtnFiltro
            funcion={nuevoRegistro} // Acción para agregar un cliente
            bgcolor="#f6f3f3"
            textcolor="#353535"
            icono={<v.agregar />}
          />
        </ContentFiltro>
        <Buscador setBuscador={setBuscador} /> {/* Componente buscador */}
      </section>

      <section className="main">
        <TablaClientes
          data={data} // Lista de clientes
          setOpenRegistrarCliente={setOpenRegistrarCliente} // Control de modal
          setDataSelect={setDataSelect} // Datos seleccionados para editar
          setAccion={setAccion} // Acción a realizar
        />
      </section>
    </Containeir>
  );
}

const Containeir = styled.div`
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  padding: 15px;
  grid-template:
    "header" 100px
    "area1" 100px
    "main" auto;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }

  .area1 {
    grid-area: area1;
    display: flex;
    align-items: center;
  }

  .main {
    grid-area: main;
    display: flex;
  }
`;
