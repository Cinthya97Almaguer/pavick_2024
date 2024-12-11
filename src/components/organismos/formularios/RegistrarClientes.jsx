import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btnsave,
  useClientesStore
} from "../../../index";
import { useForm } from "react-hook-form";

export function RegistrarClientes({ onClose, dataSelect, accion }) {
  const { insertarCliente, editarCliente } = useClientesStore();
  console.log("Funciones del store:", { insertarCliente, editarCliente });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // Memorizar valores por defecto para evitar renders innecesarios
  const memoizedData = useMemo(() => {
    return {
      id_client: dataSelect?.id_client || "",
      username: dataSelect?.username || "",
      email: dataSelect?.email || "",
      password_hash: dataSelect?.password_hash || "",
      first_name: dataSelect?.first_name || "",
      last_name: dataSelect?.last_name || "",
      phone: dataSelect?.phone || "",
      is_active: dataSelect?.is_active ?? true,
    };
  }, [dataSelect]);

  // Función para insertar o editar cliente
  async function insertar(data) {
    const p = {
      id_client: memoizedData.id_client,
      username: data.username,
      email: data.email,
      password_hash: data.password_hash || "contraseña", // Asignar "contraseña" si no se proporciona
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      is_active: data.is_active === "activo", // Convierte "activo" a true y "inactivo" a false
    };

    if (accion === "Editar") {
      await editarCliente(p);
    } else {
      await insertarCliente(p);
    }
    onClose();
  }

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>
              {accion === "Editar" ? "Editar cliente" : "Registrar nuevo cliente"}
            </h1>
          </section>
          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>

        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section>
            <article>
              <InputText>
                <input
                  className="form__field"
                  defaultValue={memoizedData.username}
                  type="text"
                  placeholder="Nombre de usuario"
                  {...register("username", { required: true })}
                />
                <label className="form__label">Nombre de Usuario</label>
                {errors.username?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText>
                <input
                  className="form__field"
                  defaultValue={memoizedData.email}
                  type="email"
                  placeholder="Correo electrónico"
                  {...register("email", { required: true })}
                />
                <label className="form__label">Correo Electrónico</label>
                {errors.email?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText>
                <input
                  className="form__field"
                  defaultValue={memoizedData.phone}
                  type="text"
                  placeholder="Teléfono"
                  {...register("phone", { required: true })}
                />
                <label className="form__label">Teléfono</label>
                {errors.phone?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText>
                <input
                  className="form__field"
                  defaultValue={memoizedData.first_name}
                  type="text"
                  placeholder="Nombre"
                  {...register("first_name", { required: true })}
                />
                <label className="form__label">Nombre</label>
                {errors.first_name?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText>
                <input
                  className="form__field"
                  defaultValue={memoizedData.last_name}
                  type="text"
                  placeholder="Apellido"
                  {...register("last_name", { required: true })}
                />
                <label className="form__label">Apellido</label>
                {errors.last_name?.type === "required" && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <label>Estado</label>
              <select
                defaultValue={memoizedData.is_active ? "activo" : "inactivo"}
                {...register("is_active", { required: true })}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </article>

            <div className="btnguardarContent">
              <Btnsave icono={<v.iconoguardar />} titulo="Guardar" bgcolor="#ef552b" />
            </div>
          </section>
        </form>
      </div>
    </Container>
  );
}




const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }

    .formulario {
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
        .colorContainer {
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
        }
      }
    }
  }
`;
