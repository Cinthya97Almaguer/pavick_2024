import styled from "styled-components";
import { 
    BtnFiltro, 
    ContentFiltro, 
    Header, 
    Title, 
    Buscador, 
    usePersonalStore, 
    TablaPersonal,
    v,
    RegistrarPersonal // Asegúrate de importar este componente
} from "../../index";
import { useState } from "react";
export function PersonalTemplate() {
  const [state, setState] = useState(false);
  const [dataSelect, setDataSelect] = useState({});
  const [openRegistrarPersonal, setOpenRegistrarPersonal] = useState(false);
  const [accion, setAccion] = useState("");

  const { datapersona, setBuscador, mostrarPersonal, parametro } = usePersonalStore();

  const nuevoRegistro = () => {
    setOpenRegistrarPersonal(!openRegistrarPersonal);
    setAccion("Nuevo");
    setDataSelect({});
  };

  return (
    <Container>
      {openRegistrarPersonal && 
        <RegistrarPersonal
          dataSelect={dataSelect} 
          accion={accion} 
          onClose={() => {
            setOpenRegistrarPersonal(!openRegistrarPersonal);
            mostrarPersonal(parametro); // Refrescar datos al cerrar
          }} 
        />
      }
      <header className="header">
          <Header stateConfig={{ state: state, setState: () => setState(!state) }} />
      </header>
      <section className="area1">
        {/* Puedes agregar más contenido aquí si es necesario */}
      </section>
      <ContentFiltro>
          <Buscador setBuscador={setBuscador} />
          <Title>
              Usuarios
          </Title>
          <BtnFiltro 
              funcion={nuevoRegistro} 
              bgcolor="#f6f3f3"
              textcolor="#353535"
              icono={<v.agregar />}
          />
      </ContentFiltro>
      <section className="main">
          <TablaPersonal 
              data={datapersona} 
              setOpenRegistrarPersonal={setOpenRegistrarPersonal}
              setDataSelect={setDataSelect} 
              setAccion={setAccion}
          />
      </section>
    </Container>
  );
}


const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  padding: 15px;
  grid-template:
    "header" 100px
    "area1" 100px
    "main" auto;
  .header {
    grid-area: header;
    /* background-color: rgba(103, 93, 241, 0.14); */
    display: flex;
    align-items: center;
  }
  .area1 {
    grid-area: area1;
    /* background-color: rgba(229, 67, 26, 0.14); */
    display: flex;
    align-items: center;
  }
  .area2 {
    grid-area: area2;
    /* background-color: rgba(77, 237, 106, 0.14); */
    display: flex;
    align-items: center;
    justify-content:end;
  }
  .main {
    grid-area: main;
    /* background-color: rgba(179, 46, 241, 0.14); */
  }
`;
