import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { InputText, Btnsave, usePaqueteStore } from "../../../index";
import { supabase } from "../../../index";
import { v } from "../../../styles/variables"; // Asegúrate de tener las variables que usas para los iconos

export function RegistratPaquetes({ onClose, dataSelect, accion }) {
  const { InsertarPaquete, editarPaquete } = usePaqueteStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  // Memorizar datos para evitar renders innecesarios
  const memoizedData = useMemo(() => ({
    id_paquete: dataSelect?.id_paquete || "",
    nombre: dataSelect?.nombre || "",
    precio: dataSelect?.precio || "",
    productos: dataSelect?.productos || [],
  }), [dataSelect]);

  useEffect(() => {
    async function fetchProductos() {
      const { data, error } = await supabase.from("products").select("product_id, name,description, stock_quantity");
      if (!error) setProductos(data);
    }
    fetchProductos();
  }, []);

  const handleAddProduct = () => {
    setProductosSeleccionados([...productosSeleccionados, { id: "", cantidad: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...productosSeleccionados];
    updated[index][field] = value;
    setProductosSeleccionados(updated);
  };

  async function insertar(data) {
    const payload = {
      nombre: data.nombre,
      precio: parseFloat(data.precio),
      productos: productosSeleccionados.map((p) => ({
        producto_id: p.id,
        cantidad: parseInt(p.cantidad, 10),
      })),
    };
    console.log("Datos para editar:", JSON.stringify(dataSelect, null, 2));
    console.log("Payload para editar:", JSON.stringify(payload, null, 2));
    console.log("Payload para insertar:", payload.productos);
    if (accion === "Nuevo") {
      await InsertarPaquete(payload, payload.productos);
    } else if (accion === "Editar") {
      await editarPaquete(dataSelect, payload, payload.productos);
    }
    onClose();
  }

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>{accion === "Editar" ? "Editar Paquete" : "Registrar Paquete"}</h1>
          </section>
          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>
        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section>
            <article>
              <InputText icono={<v.iconomarca />}>
                <input
                  className="form__field"
                  defaultValue={memoizedData.nombre}
                  type="text"
                  placeholder=""
                  {...register("nombre", { required: true })}
                />
                <label className="form__label">Nombre del paquete</label>
                {errors.nombre && <p>Campo requerido</p>}
              </InputText>
            </article>
            <article>
              <InputText icono={<v.iconomarca />}>
                <input
                  className="form__field"
                  defaultValue={memoizedData.precio}
                  type="number"
                  step="0.01"
                  placeholder=""
                  {...register("precio", { required: true, min: 0 })}
                />
                <label className="form__label">Precio</label>
                {errors.precio && <p>Campo requerido</p>}
              </InputText>
            </article>
            <div>
              <h4>Productos del Paquete:</h4>
              {productosSeleccionados.map((producto, index) => (
                <div key={index} className="producto-item">
                  <select
                    value={producto.id}
                    onChange={(e) => handleProductChange(index, "id", e.target.value)}
                    className="form__field"
                  >
                    <option value="">Seleccione un producto</option>
                    {productos.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                         {p.name}-{p.description} (Stock: {p.stock_quantity})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={producto.cantidad}
                    min="1"
                    onChange={(e) => handleProductChange(index, "cantidad", e.target.value)}
                    className="form__field"
                  />
                  <button type="button" onClick={() => handleRemoveProduct(index)} className="btn-remove">
                    Eliminar
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddProduct} className="btn-add">Agregar Producto</button>
            </div>
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
    padding: 20px;
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

    .formulario section {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .producto-item {
        display: flex;
        align-items: center;
        gap: 10px;

        select, input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .btn-remove {
          padding: 5px 10px;
          color: white;
          background-color: #ef552b;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      }

      .btn-add {
        padding: 8px;
        color: white;
        background-color: #ef552b;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
`;
