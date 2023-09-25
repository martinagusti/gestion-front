import { useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./clientes.css";

import { AuthContext } from "../context/AuthContext";
import { createCliente, deleteCliente, editCliente } from "../services";
import { getClientes } from "../services/clientesService";

function Clientes({ clientes, setClientes, nivel, proyectos }) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const [viewInsertCliente, setViewInsertCliente] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [idEdit, setIdEdit] = useState();

  const [nombre, setNombre] = useState(null);
  const [razonSocial, setRazonSocial] = useState(null);
  const [cif, setCif] = useState(null);
  const [direccion, setDireccion] = useState(null);
  const [responsable, setResponsable] = useState(null);
  const [telefono_1, setTelefono_1] = useState(null);
  const [telefono_2, setTelefono_2] = useState(null);
  const [email_1, setEmail_1] = useState(null);
  const [email_2, setEmail_2] = useState(null);
  const [sector, setSector] = useState(null);
  const [fuente, setFuente] = useState(null);
  const [web, setWeb] = useState(null);
  const [url_instagram, setUrl_instagram] = useState(null);
  const [url_facebook, setUrl_facebook] = useState(null);
  const [anotaciones_hosting, setAnotaciones_hosting] = useState(null);
  const [anotaciones_cliente, setAnotaciones_cliente] = useState(null);

  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  if (nivel == "empleado") {
    const clientesPermitidos = [];
    for (let i = 0; i < proyectos.length; i++) {
      clientesPermitidos.push(proyectos[i].id_cliente);
    }

    clientes = clientes.filter((element) => {
      if (clientesPermitidos.includes(element.id)) {
        return element.id;
      }
    });
  }

  clientes = clientes.sort(function (a, b) {
    if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) {
      return -1;
    }
    if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  const navigateTo = useNavigate();

  const onSubmit = async (data, e) => {
    e.preventDefault();
    console.log(data);
    const {
      nombre,
      razon_social,
      cif,
      direccion,
      responsable,
      telefono_1,
      telefono_2,
      email_1,
      email_2,
      sector,
      fuente,
      web,
      url_instagram,
      url_facebook,
      anotaciones_hosting,
      anotaciones_cliente,
    } = data;

    try {
      const created = await createCliente(
        nombre,
        razon_social,
        cif,
        direccion,
        responsable,
        telefono_1,
        telefono_2,
        email_1,
        email_2,
        sector,
        fuente,
        web,
        url_instagram,
        url_facebook,
        anotaciones_hosting,
        anotaciones_cliente
      );

      console.log(created);
      console.log(created[0]);
      const date = new Date();
      created[0].fecha_alta = date;

      setClientes([created[0], ...clientes]);
      reset();

      setErrorText(null);
      setViewInsertCliente(false);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const createNewCliente = () => {
    setViewInsertCliente(true);
  };

  const deleteModal = (element) => {
    console.log(element.id);
    setEliminando(true);
    setIdDelete(element.id);
  };

  const confirmDelete = async () => {
    try {
      const deleted = await deleteCliente(idDelete);

      if (deleted) {
        setClientes(
          clientes.filter((cliente) => {
            return cliente.id !== idDelete;
          })
        );
      }
      setErrorText(null);
      setEliminando(false);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const edit = (element) => {
    setEditando(true);
    setNombre(element.nombre);
    setRazonSocial(element.razon_social);
    setCif(element.cif);
    setDireccion(element.direccion);
    setResponsable(element.responsable);
    setTelefono_1(element.telefono_1);
    setTelefono_2(element.telefono_2);
    setEmail_1(element.email_1);
    setEmail_2(element.email_2);
    setSector(element.sector);
    setFuente(element.fuente);
    setWeb(element.web);
    setUrl_instagram(element.url_instagram);
    setUrl_facebook(element.url_facebook);
    setAnotaciones_hosting(element.anotaciones_hosting);
    setAnotaciones_cliente(element.anotaciones_cliente);
    setIdEdit(element.id);
  };

  const editar = async (event) => {
    event.preventDefault();

    try {
      const edited = await editCliente(
        event.target.nombre.value,
        event.target.razon_social.value,
        event.target.cif.value,
        event.target.direccion.value,
        event.target.responsable.value,
        event.target.telefono_1.value,
        event.target.telefono_2.value,
        event.target.email_1.value,
        event.target.email_2.value,
        event.target.sector.value,
        event.target.fuente.value,
        event.target.web.value,
        event.target.url_instagram.value,
        event.target.url_facebook.value,
        event.target.anotaciones_hosting.value,
        event.target.anotaciones_cliente.value,
        idEdit
      );

      setClientes(await getClientes());
      setEditando(false);

      setErrorText(null);
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  const handleOnChangeNombre = (e) => {
    setNombre(e.target.value);
  };

  const handleOnChangeRazonSocial = (e) => {
    setRazonSocial(e.target.value);
  };

  const handleOnChangeCif = (e) => {
    setCif(e.target.value);
  };

  const handleOnChangeDireccion = (e) => {
    setDireccion(e.target.value);
  };

  const handleOnChangeResponsable = (e) => {
    setResponsable(e.target.value);
  };

  const handleOnChangeTelefono_1 = (e) => {
    setTelefono_1(e.target.value);
  };

  const handleOnChangeTelefono_2 = (e) => {
    setTelefono_2(e.target.value);
  };

  const handleOnChangeEmail_1 = (e) => {
    setEmail_1(e.target.value);
  };

  const handleOnChangeEmail_2 = (e) => {
    setEmail_2(e.target.value);
  };

  const handleOnChangeSector = (e) => {
    setSector(e.target.value);
  };

  const handleOnChangeFuente = (e) => {
    setFuente(e.target.value);
  };

  const handleOnChangeWeb = (e) => {
    setWeb(e.target.value);
  };

  const handleOnChangeUrl_instagram = (e) => {
    setUrl_instagram(e.target.value);
  };

  const handleOnChangeUrl_facebook = (e) => {
    setUrl_facebook(e.target.value);
  };

  const handleOnChangeAnotaciones_hosting = (e) => {
    setAnotaciones_hosting(e.target.value);
  };

  const handleOnChangeAnotaciones_cliente = (e) => {
    setAnotaciones_cliente(e.target.value);
  };

  const handleOnChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchByName = async () => {
    const allClientes = await getClientes();
    const filtered = allClientes.filter((element) => {
      return element.nombre.toLowerCase().includes(search.toLowerCase());
    });
    if (search !== "") {
      setClientes(filtered);
    } else {
      setClientes(allClientes);
    }
  };

  return (
    <div className="clientes-container">
      {nivel !== "empleado" && (
        <button onClick={() => createNewCliente()}>Insertar Cliente</button>
      )}

      <input
        type="text"
        defaultValue={search}
        onChange={handleOnChangeSearch}
      ></input>
      <button onClick={() => searchByName()}>Buscar</button>

      {viewInsertCliente && (
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
                id="razon_social"
                placeholder="Razon Social"
                {...register("razon_social", {
                  required: true,
                })}
              />
              {errors.razon_social?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="text"
                id="cif"
                placeholder="CIF"
                {...register("cif", {
                  required: true,
                })}
              />
              {errors.cif?.type === "required" && <span>Campo requerido</span>}

              <input
                type="text"
                id="direccion"
                placeholder="Direccion"
                {...register("direccion", {
                  required: true,
                })}
              />
              {errors.direccion?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="text"
                id="responsable"
                placeholder="Responsable"
                {...register("responsable", {
                  required: true,
                })}
              />
              {errors.responsable?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="text"
                id="telefono_1"
                placeholder="Telefono_1"
                {...register("telefono_1", {
                  required: true,
                })}
              />
              {errors.telefono_1?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="text"
                id="telefono_2"
                placeholder="Telefono_2"
                {...register("telefono_2", {})}
              />

              <input
                type="text"
                placeholder="Email_1"
                {...register("email_1", {
                  required: true,
                  pattern:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
              />

              {errors.email_1?.type === "required" && (
                <span>Campo requerido</span>
              )}
              {errors.email_1?.type === "pattern" && (
                <span>Email no es valido</span>
              )}

              <input
                type="text"
                placeholder="Email_2"
                {...register("email_2", {})}
              />

              <input
                type="text"
                id="sector"
                placeholder="Sector"
                {...register("sector", {
                  required: true,
                })}
              />
              {errors.sector?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="text"
                id="fuente"
                placeholder="Fuente"
                {...register("fuente", {
                  required: true,
                })}
              />
              {errors.fuente?.type === "required" && (
                <span>Campo requerido</span>
              )}

              <input
                type="text"
                id="web"
                placeholder="Web"
                {...register("web", {})}
              />

              <input
                type="text"
                id="url_instagram"
                placeholder="Url instagram"
                {...register("url_instagram", {})}
              />

              <input
                type="text"
                id="url_facebook"
                placeholder="Url facebook"
                {...register("url_facebook", {})}
              />

              <input
                type="text"
                id="anotaciones_hosting"
                placeholder="Anotaciones Hosting"
                {...register("anotaciones_hosting", {})}
              />

              <input
                type="text"
                id="anotaciones_cliente"
                placeholder="Anotaciones Cliente"
                {...register("anotaciones_cliente", {})}
              />

              <div className="modal-actions">
                <button type="submit">CREAR</button>
                <button
                  type="button"
                  onClick={() => {
                    setViewInsertCliente(false);
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

      <div className="box-table-content">
        <table className="content-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Razon Social</th>
              <th>CIF</th>
              <th>Direccion</th>
              <th>Responsable</th>
              <th>Telefono_1</th>
              <th>Telefono_2</th>
              <th>Email_1</th>
              <th>Email_2</th>
              <th>Sector</th>
              <th>Fuente</th>
              <th>Web</th>
              <th>Url_Instagram</th>
              <th>Url_Facebook</th>
              <th>Anotaciones Hosting</th>
              <th>Anotaciones cliente</th>
              <th>Fecha alta</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((element, index) => {
              const date = new Date(element.fecha_alta);
              return (
                <tr key={index}>
                  <td>{element.nombre}</td>
                  <td>{element.razon_social}</td>
                  <td>{element.cif}</td>
                  <td>{element.direccion}</td>
                  <td>{element.responsable}</td>
                  <td>{element.telefono_1}</td>
                  <td>{element.telefono_2}</td>
                  <td>{element.email_1}</td>
                  <td>{element.email_2}</td>
                  <td>{element.sector}</td>
                  <td>{element.fuente}</td>
                  <td>{element.web}</td>
                  <td>{element.url_instagram}</td>
                  <td>{element.url_facebook}</td>
                  <td>{element.anotaciones_hosting}</td>
                  <td>{element.anotaciones_cliente}</td>
                  <td>{`${date.getDate()}/${
                    date.getMonth() + 1
                  }/${date.getFullYear()}`}</td>

                  <td>
                    {nivel !== "empleado" && (
                      <button
                        onClick={() => edit(element)}
                        className="empleados-btn-editar"
                      ></button>
                    )}
                    {nivel == "administrador" && (
                      <button
                        onClick={() => deleteModal(element)}
                        className="empleados-btn-eliminar"
                      ></button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {eliminando && (
          <div className="modal-container">
            <div className="modal">
              <label>Seguro desea eliminar este cliente? </label>
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

                <label>Razon Social</label>
                <input
                  type="text"
                  name="razon_social"
                  defaultValue={razonSocial}
                  onChange={handleOnChangeRazonSocial}
                />

                <label>CIF</label>
                <input
                  type="text"
                  name="cif"
                  defaultValue={cif}
                  onChange={handleOnChangeCif}
                />

                <label>Direccion</label>
                <input
                  type="text"
                  name="direccion"
                  defaultValue={direccion}
                  onChange={handleOnChangeDireccion}
                />

                <label>Responsable</label>
                <input
                  type="text"
                  name="responsable"
                  defaultValue={responsable}
                  onChange={handleOnChangeResponsable}
                />

                <label>Telefono 1</label>
                <input
                  type="text"
                  name="telefono_1"
                  defaultValue={telefono_1}
                  onChange={handleOnChangeTelefono_1}
                />

                <label>Telefono 2</label>
                <input
                  type="text"
                  name="telefono_2"
                  defaultValue={telefono_2}
                  onChange={handleOnChangeTelefono_2}
                />

                <label>Email 1</label>
                <input
                  type="text"
                  name="email_1"
                  defaultValue={email_1}
                  onChange={handleOnChangeEmail_1}
                />

                <label>Email 2</label>
                <input
                  type="text"
                  name="email_2"
                  defaultValue={email_2}
                  onChange={handleOnChangeEmail_2}
                />

                <label>Sector</label>
                <input
                  type="text"
                  name="sector"
                  defaultValue={sector}
                  onChange={handleOnChangeSector}
                />

                <label>Fuente</label>
                <input
                  type="text"
                  name="fuente"
                  defaultValue={fuente}
                  onChange={handleOnChangeFuente}
                />

                <label>Web</label>
                <input
                  type="text"
                  name="web"
                  defaultValue={web}
                  onChange={handleOnChangeWeb}
                />

                <label>Url Instagram</label>
                <input
                  type="text"
                  name="url_instagram"
                  defaultValue={url_instagram}
                  onChange={handleOnChangeUrl_instagram}
                />

                <label>Url Facebook</label>
                <input
                  type="text"
                  name="url_facebook"
                  defaultValue={url_facebook}
                  onChange={handleOnChangeUrl_facebook}
                />

                <label>Anotaciones Hosting</label>
                <input
                  type="text"
                  name="anotaciones_hosting"
                  defaultValue={anotaciones_hosting}
                  onChange={handleOnChangeAnotaciones_hosting}
                />

                <label>Anotaciones Cliente</label>
                <input
                  type="text"
                  name="anotaciones_cliente"
                  defaultValue={anotaciones_cliente}
                  onChange={handleOnChangeAnotaciones_cliente}
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
      </div>
    </div>
  );
}

export default Clientes;
