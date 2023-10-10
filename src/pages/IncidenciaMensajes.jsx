import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useContext, useState, useRef } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import "./incidenciaMensajes.css";

import { AuthContext } from "../context/AuthContext";
import {
  createIncidencia,
  createIncidenciaMensaje,
  getMensajeArchivos,
} from "../services";
import Incidencias from "./Incidencias";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      {
        color: [],
      },
      {
        background: [],
      },
    ],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { list: "+1" }],
    ["link", "image"],
  ],
};

function IncidenciaMensajes({
  mensajes,
  setMensajes,
  idIncidencia,
  nivel,
  mensajesArchivos,
  setMensajesArchivos,
}) {
  const { setToken, setUser, token } = useContext(AuthContext);
  const [errorText, setErrorText] = useState();

  const [value, setValue] = useState("");
  const [fileId, setFileId] = useState();
  const [fileName, setFileName] = useState("");
  const [viewFileModal, setViewFileModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("gestionUser"));

  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const { mensaje } = data;

    try {
      if (value !== `<p><br></p>`) {
        console.log(value);
        const created = await createIncidenciaMensaje(
          idIncidencia,
          nivel == "cliente" ? user.nombre : "Online Valles",
          value
        );

        console.log(created);
        const fech = new Date(created[0].fecha);
        console.log(fech.getHours());

        setMensajes([created[0], ...mensajes]);
        setErrorText(null);
        setValue("");
        reset();
      }
    } catch (error) {
      console.log(error);
      setErrorText(error.response.data.error);
    }
  };

  let mensajesIncidencia = mensajes.filter((element) => {
    return element.id_incidencia == idIncidencia;
  });

  mensajes.sort((a, b) => {
    return b.id - a.id;
  });

  const handleOnChangeFileName = (e) => {
    setFileName(e.target.value);
  };

  const cargarArchivo = async () => {
    const date = new Date();

    setTimeout(async () => {
      const mensajeArchivos = await getMensajeArchivos();

      setMensajesArchivos(mensajeArchivos);
      setViewFileModal(false);
    }, 1000);
  };

  return (
    <div className="incidenciasMensajes-container">
      {nivel == "cliente" && (
        <div>
          <button onClick={() => navigateTo("/incidencias")}>VOLVER</button>
        </div>
      )}
      <div className="mensajes-container">
        {mensajesIncidencia.map((element, index) => {
          const fecha = new Date(element.fecha);
          let pad = fecha.getMinutes() + "";
          pad.padStart(2, "0");

          return (
            <div key={index} className="mensaje">
              <div className="asunto">
                {" "}
                {`${fecha.getDate()}/${
                  fecha.getMonth() + 1
                }/${fecha.getFullYear()} ${fecha.getHours()}:${pad.padStart(
                  2,
                  "0"
                )} ${element.remitente}`}
              </div>
              <div className="mensaje-container">
                <div
                  className="texto"
                  dangerouslySetInnerHTML={{ __html: element.mensaje }}
                ></div>
                {mensajesArchivos.map((archivos, index) => {
                  if (archivos.id_mensaje == element.id) {
                    return (
                      <div key={index}>
                        {" "}
                        <a
                          href={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/incidenciaFiles/${archivos.nombre}`}
                          target="_blank"
                          download="archivo.txt"
                        >
                          {archivos.nombre}
                        </a>
                      </div>
                    );
                  }
                })}
              </div>

              <div>
                <form
                  onSubmit={() => cargarArchivo()}
                  action={`${
                    import.meta.env.VITE_BACKEND_URL
                  }/incidencias/files/${fileId}`}
                  target="_blank"
                  method="post"
                  encType="multipart/form-data"
                  className="form-edit-container"
                >
                  <input
                    type="file"
                    name="file"
                    id=""
                    /* defaultValue={fileName} */
                    onChange={handleOnChangeFileName}
                    multiple
                  />

                  <div className="modal-actions">
                    <button type="submit" onClick={() => setFileId(element.id)}>
                      SUBIR
                    </button>
                  </div>
                </form>
              </div>
            </div>
          );
        })}
      </div>
      <div className="envio-mensaje-container">
        <label>ENVIAR UN MENSAJE</label>
        <form
          method="post"
          onSubmit={handleSubmit(onSubmit)}
          className="form-mensajes"
        >
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            className="editor-input"
            modules={modules}
          />

          {errors.mensaje?.type === "required" && <span>Campo requerido</span>}
          {/* <textarea
            id="mensaje"
            placeholder="Mensaje"
            className="incidencia-mensaje-input"
            {...register("mensaje", {
              required: true,
            })}
          />
          {errors.mensaje?.type === "required" && <span>Campo requerido</span>} */}

          <div className="modal-actions">
            <button type="submit">ENVIAR</button>
          </div>
          {errorText && <span>{errorText}</span>}
        </form>
      </div>
    </div>
  );
}

export default IncidenciaMensajes;
