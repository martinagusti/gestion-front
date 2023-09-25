import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./empleados.css";

import { AuthContext } from "../context/AuthContext";
import {
  createEmpleado,
  deleteEmpleado,
  editEmpleado,
  getEmpleados,
} from "../services";

function Empleados({ empleados, setEmpleados }) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const [viewInsertEmpleado, setViewInsertEmpleado] = useState(false);
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [nombre, setNombre] = useState(false);
  const [apellido, setApellido] = useState(false);
  const [nivel, setNivel] = useState(false);
  const [password, setPassword] = useState();
  const [verifyPassword, setVerifyPassword] = useState();
  const [idEdit, setIdEdit] = useState("");
  const [idDelete, setIdDelete] = useState();

  const navigateTo = useNavigate();

  console.log(empleados);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();
    console.log(data);
    const { nombre, apellido, email, password, verifyPassword, nivel } = data;

    try {
      const created = await createEmpleado(
        nombre,
        apellido,
        email,
        password,
        verifyPassword,
        nivel
      );
      console.log(created);
      setEmpleados([created[0], ...empleados]);
      reset();
      setViewInsertEmpleado(false);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const createNewEmpleado = () => {
    setViewInsertEmpleado(true);
  };

  const edit = (element) => {
    setEditando(true);
    setNombre(element.nombre);
    setApellido(element.apellido);
    setNivel(element.nivel);
    setIdEdit(element.id);
  };

  const deleteEmpleadoFunction = (element) => {
    setIdDelete(element.id);
    setEliminando(true);
  };

  const confirmDelete = async () => {
    try {
      const deleted = await deleteEmpleado(idDelete);
      if (deleted) {
        setEliminando(false);
        setEmpleados(
          empleados.filter((element) => {
            return element.id != idDelete;
          })
        );
      }
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const editar = async (event) => {
    event.preventDefault();

    try {
      const edited = await editEmpleado(
        event.target.nombre.value,
        event.target.apellido.value,
        event.target.password.value,
        event.target.verifyPassword.value,
        event.target.nivel.value,
        idEdit
      );

      setEmpleados(await getEmpleados());
      setEditando(false);
      setPassword("");
      setVerifyPassword("");
      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const handleOnChangeNombre = (e) => {
    setNombre(e.target.value);
  };

  const handleOnChangeApellido = (e) => {
    setApellido(e.target.value);
  };

  const handleOnChangeNivel = (e) => {
    setNivel(e.target.value);
  };

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleOnChangeVerifyPassword = (e) => {
    setVerifyPassword(e.target.value);
  };

  return (
    <div className="empleados-container">
      <button onClick={() => createNewEmpleado()}>Insertar Empleado</button>
      {viewInsertEmpleado && (
        <div className="empleado-create-modal-container">
          <div className="empleado-create-modal">
            <form
              className="empleado-form-container"
              method="post"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                type="text"
                id="nombre"
                placeholder="Nombre"
                {...register("nombre", {
                  required: true,
                })}
              />
              {errors.nombre?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="text"
                id="apellido"
                placeholder="Apellidos"
                {...register("apellido", {
                  required: true,
                })}
              />
              {errors.apellido?.type === "required" && (
                <span>Campo requerido</span>
              )}
              <input
                type="text"
                placeholder="Email"
                {...register("email", {
                  required: true,
                  pattern:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
              />

              {errors.email?.type === "required" && (
                <span>Campo requerido</span>
              )}
              {errors.email?.type === "pattern" && (
                <span>Email no es valido</span>
              )}

              <input
                type="password"
                id="password"
                placeholder="Password"
                {...register("password", {
                  required: true,
                })}
              />
              {errors.password?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="password"
                id="verifyPassword"
                placeholder="VerifyPassword"
                {...register("verifyPassword", {
                  required: true,
                })}
              />
              {errors.verifyPassword?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <select
                name="nivel"
                id="nivel"
                {...register("nivel", {
                  required: true,
                })}
              >
                <option value="administrador">Administrador</option>
                <option value="responsable">Responsable</option>
                <option value="empleado">Empleado</option>
              </select>

              {errors.nivel?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <div className="modal-actions">
                <button type="submit">CREAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewInsertEmpleado(false);
                    setErrorText(null);
                  }}
                >
                  CANCELAR
                </button>
              </div>
              {errorText && <span>{errorText}</span>}
            </form>
          </div>
        </div>
      )}

      {editando && (
        <div className="modal-container">
          <div className="modal">
            <form
              className="form-edit-container"
              onSubmit={(event) => {
                editar(event);
              }}
            >
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                defaultValue={nombre}
                onChange={handleOnChangeNombre}
              />
              <label>Apellidos</label>
              <input
                type="text"
                name="apellido"
                defaultValue={apellido}
                onChange={handleOnChangeApellido}
              />
              <label>Nivel</label>
              <select
                name="nivel"
                id="nivel"
                defaultValue={nivel}
                onChange={handleOnChangeNivel}
              >
                <option value="administrador">Administrador</option>
                <option value="responsable">Responsable</option>
                <option value="empleado">Empleado</option>
              </select>

              <label>Password</label>
              <input
                type="password"
                name="password"
                defaultValue={password}
                onChange={handleOnChangePassword}
              />

              <label>Confirm Password</label>
              <input
                type="password"
                name="verifyPassword"
                defaultValue={verifyPassword}
                onChange={handleOnChangeVerifyPassword}
              />

              {errorText && <span>{errorText}</span>}
              <div className="modal-actions">
                <button type="submit">GUARDAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setEditando(false);
                    setErrorText(null);
                  }}
                >
                  CANCELAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {eliminando && (
        <div className="modal-container">
          <div className="modal">
            <label>Seguro desea eliminar este usuario? </label>
            <div className="modal-actions">
              <button
                onClick={() => {
                  confirmDelete();
                }}
              >
                ELIMINAR
              </button>
              <button
                type="button"
                onClick={() => {
                  setEliminando(false);
                  setErrorText(null);
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="box-table-content">
        <table className="content-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Nivel</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {empleados.map((element, index) => {
              return (
                <tr key={index}>
                  <td>{element.nombre}</td>
                  <td>{element.apellido}</td>
                  <td>{element.email}</td>
                  <td>{element.nivel}</td>

                  <td>
                    <button
                      onClick={() => edit(element)}
                      className="empleados-btn-editar"
                    ></button>
                    <button
                      onClick={() => deleteEmpleadoFunction(element)}
                      className="empleados-btn-eliminar"
                    ></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Empleados;
