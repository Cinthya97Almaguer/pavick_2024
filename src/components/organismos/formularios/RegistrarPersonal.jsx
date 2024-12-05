import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import { ObtenerIdAuthSupabase, InputText, Btnsave, usePersonalStore } from "../../../index";
import { useForm } from "react-hook-form";

export function RegistrarPersonal({ onClose, dataSelect, accion }) {
  const { insertarPersonal, editarPersonal } = usePersonalStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();


  // Memorizar valores por defecto para evitar renders innecesarios
  const memoizedData = useMemo(() => {
    return {
      id: dataSelect?.id || "",
      nombres: dataSelect?.nombres || "",
      telefono: dataSelect?.telefono || "",
      correo: dataSelect?.correo || "",
      tipouser: dataSelect?.tipouser || "",
      direccion: dataSelect?.direccion || "",
      fecharegistro: dataSelect?.fecharegistro || new Date().toISOString(),
      estado: dataSelect?.estado || "activo",
    };
  }, [dataSelect]);

  // Acción para insertar personal
  async function insertar(data) {
    const p = {
      id: memoizedData.id,
      nombres: data.nombres,
      telefono: data.telefono,
      correo: data.correo,
      tipouser: data.tipouser,
      direccion: data.direccion,
      fecharegistro: data.fecharegistro || new Date().toISOString(),
      estado: data.estado || "activo",
      idauth: await ObtenerIdAuthSupabase(), // Obtener el idAuth
    };

    // Verificar si la acción es de editar o insertar
    if (accion === "Editar") {
      // Llamar a la función de edición de personal
      await editarPersonal(p);
    } else {
      // Llamar a la función para insertar nuevo personal
      await insertarPersonal(p);
    }

    // Cerrar el formulario una vez insertado o editado
    onClose();
  }

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>{accion === "Editar" ? "Editar personal" : "Registrar nuevo personal"}</h1>
          </section>
          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>
        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section>
            {/* Campo de nombre */}
            <article>
              <InputText icono={<v.iconomarca />}>
                <input
                  className="form__field"
                  type="text"
                  placeholder="Nombre completo"
                  defaultValue={memoizedData.nombres} // Valor por defecto
                  {...register("nombres", { required: "El nombre es obligatorio" })}
                />
                <label className="form__label">Nombre</label>
                {errors.nombres && <p>{errors.nombres.message}</p>}
              </InputText>
            </article>
            {/* Campo de teléfono */}
            <article>
              <InputText icono={<v.iconomarca />}>
                <input
                  className="form__field"
                  type="text"
                  placeholder="Teléfono"
                  defaultValue={memoizedData.telefono} // Valor por defecto
                  {...register("telefono", {
                    required: "El teléfono es obligatorio",
                    pattern: { value: /^[0-9]{10}$/, message: "Debe ser un número de 10 dígitos" },
                  })}
                />
                <label className="form__label">Teléfono</label>
                {errors.telefono && <p>{errors.telefono.message}</p>}
              </InputText>
            </article>
            {/* Campo de correo */}
            <article>
              <InputText icono={<v.iconomarca />}>
                <input
                  className="form__field"
                  type="email"
                  placeholder="Correo electrónico"
                  defaultValue={memoizedData.correo} // Valor por defecto
                  {...register("correo", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Correo no válido",
                    },
                  })}
                />
                <label className="form__label">Correo</label>
                {errors.correo && <p>{errors.correo.message}</p>}
              </InputText>
            </article>
            {/* Campo de tipo de usuario */}
            <article>
              <InputText icono={<v.iconomarca />}>
                <select
                  className="form__field"
                  defaultValue={memoizedData.tipouser} // Valor por defecto
                  {...register("tipouser", { required: "El tipo de usuario es obligatorio" })}
                >
                  <option value="administrador">administrador</option>
                  <option value="empleado">empleado</option>
                </select>
                <label className="form__label">Tipo de Usuario</label>
                {errors.tipouser && <p>{errors.tipouser.message}</p>}
              </InputText>
            </article>

            
            <div className="btnguardarContent">
              <Btnsave
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#ef552b"
              />
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
      }
    }
  }
`;
