/* ============================================================
   CONTROL DEL FORMULARIO Y VALIDACIÓN EN TIEMPO REAL
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario-inscripcion");
  const mensajeFormulario = document.getElementById("mensaje-formulario");
  const grupoCondiciones = document.getElementById("grupo-condiciones");
  const checkboxesCondiciones = document.querySelectorAll('input[name="condiciones"]');

  // Lista de campos que tienen validación individual
  const camposValidados = [
    "nombre",
    "apellidos",
    "dni",
    "fecha-nacimiento",
    "email",
    "telefono",
    "direccion",
    "ciudad",
    "codigo-postal",
    "altura",
    "peso",
    "objetivos",
    "plan",
    "franja-horaria",
    "nif-factura",
    "iban",
    "tos",
    "rgpd"
  ];

  // Dibuja y muestra la lista de requisitos debajo de un campo
  function mostrarRequisitos(listaElemento, requisitos, mostrarErrores) {
    if (!listaElemento) {
      return;
    }

    listaElemento.innerHTML = "";
    listaElemento.classList.add("visible");

    for (let i = 0; i < requisitos.length; i++) {
      const requisito = requisitos[i];
      const item = document.createElement("li");

      if (requisito.cumplido === true) {
        item.className = "requisito valido";
        item.textContent = "✓ " + requisito.texto;
      } else if (requisito.cumplido === false && mostrarErrores) {
        item.className = "requisito invalido";
        item.textContent = "✕ " + requisito.texto;
      } else {
        item.className = "requisito pendiente";
        item.textContent = "• " + requisito.texto;
      }

      listaElemento.appendChild(item);
    }
  }

  // Oculta la lista de requisitos de un campo
  function ocultarRequisitos(listaElemento) {
    if (!listaElemento) {
      return;
    }

    listaElemento.classList.remove("visible");
    listaElemento.innerHTML = "";
  }

  // Oculta todas las listas de requisitos abiertas antes de mostrar una nueva
  function ocultarTodosLosRequisitos() {
    for (let i = 0; i < camposValidados.length; i++) {
      ocultarRequisitos(document.getElementById("req-" + camposValidados[i]));
    }
    ocultarRequisitos(document.getElementById("req-condiciones"));
  }

  // Aplica el borde o estado visual verde/rojo al campo según su validez
  function actualizarEstiloCampo(campo, esValido, mostrarErrores, esOpcionalVacio) {
    if (campo.type === "checkbox") {
      const etiqueta = campo.parentElement;
      if (!esValido && mostrarErrores) {
        campo.setAttribute("aria-invalid", "true");
        if (etiqueta) {
          etiqueta.classList.add("campo-invalido");
        }
      } else {
        campo.removeAttribute("aria-invalid");
        if (etiqueta) {
          etiqueta.classList.remove("campo-invalido");
        }
      }
      return;
    }

    campo.classList.remove("campo-valido", "campo-invalido");

    if (esOpcionalVacio) {
      campo.removeAttribute("aria-invalid");
    } else if (esValido) {
      campo.classList.add("campo-valido");
      campo.removeAttribute("aria-invalid");
    } else if (mostrarErrores) {
      campo.classList.add("campo-invalido");
      campo.setAttribute("aria-invalid", "true");
    } else {
      campo.removeAttribute("aria-invalid");
    }
  }

  // Obtiene los requisitos evaluados según el id del campo
  function obtenerRequisitosCampo(campo) {
    const id = campo.id;
    const valor = campo.value;
    const entradaInvalida = campo.validity ? campo.validity.badInput : false;

    if (id === "nombre") return validarNombre(valor);
    if (id === "apellidos") return validarApellidos(valor);
    if (id === "dni") return validarDni(valor);
    if (id === "fecha-nacimiento") return validarFechaNacimiento(valor);
    if (id === "email") return validarEmail(valor);
    if (id === "telefono") return validarTelefono(valor);
    if (id === "direccion") return validarDireccion(valor);
    if (id === "ciudad") return validarCiudad(valor);
    if (id === "codigo-postal") return validarCodigoPostal(valor);
    if (id === "altura") return validarAltura(valor, entradaInvalida);
    if (id === "peso") return validarPeso(valor, entradaInvalida);
    if (id === "objetivos") return validarObjetivos(valor);
    if (id === "plan") return validarPlan(valor);
    if (id === "franja-horaria") return validarFranjaHoraria(valor);
    if (id === "nif-factura") return validarNifFactura(valor);
    if (id === "iban") return validarIban(valor);
    if (id === "tos") return validarTerminos(campo.checked);
    if (id === "rgpd") return validarPrivacidad(campo.checked);

    return [];
  }

  // Valida un campo, actualiza su borde y muestra u oculta su lista de requisitos
  function validarCampo(campo, mostrarErrores, mostrarLista) {
    const lista = document.getElementById("req-" + campo.id);
    const requisitos = obtenerRequisitosCampo(campo);
    const esValido = todosRequisitosCumplidos(requisitos);
    const esOpcionalVacio = requisitos.length === 1 && requisitos[0].cumplido === null;

    if (mostrarLista) {
      mostrarRequisitos(lista, requisitos, mostrarErrores);
    } else {
      ocultarRequisitos(lista);
    }

    actualizarEstiloCampo(campo, esValido, mostrarErrores, esOpcionalVacio);

    return esValido;
  }

  // Valida el grupo de checkboxes de condiciones médicas
  function validarGrupoCondiciones(mostrarErrores, mostrarLista) {
    const lista = document.getElementById("req-condiciones");
    const requisitos = validarCondicionesMedicas(checkboxesCondiciones);
    const esValido = todosRequisitosCumplidos(requisitos);

    if (mostrarLista) {
      mostrarRequisitos(lista, requisitos, mostrarErrores);
    } else {
      ocultarRequisitos(lista);
    }

    if (grupoCondiciones) {
      if (!esValido && mostrarErrores) {
        grupoCondiciones.classList.add("campo-invalido");
      } else {
        grupoCondiciones.classList.remove("campo-invalido");
      }
    }

    return esValido;
  }

  // Gestiona que "Ninguna" sea excluyente con el resto de condiciones médicas
  function actualizarExclusividadCondiciones(checkboxPulsado) {
    let checkboxNinguna = null;
    const otrasCondiciones = [];

    for (let i = 0; i < checkboxesCondiciones.length; i++) {
      if (checkboxesCondiciones[i].value === "ninguna") {
        checkboxNinguna = checkboxesCondiciones[i];
      } else {
        otrasCondiciones.push(checkboxesCondiciones[i]);
      }
    }

    if (!checkboxNinguna) {
      return;
    }

    if (checkboxPulsado === checkboxNinguna) {
      for (let i = 0; i < otrasCondiciones.length; i++) {
        otrasCondiciones[i].checked = false;
        otrasCondiciones[i].disabled = checkboxNinguna.checked;
        otrasCondiciones[i].parentElement.classList.toggle("deshabilitada", checkboxNinguna.checked);
      }
    } else {
      let hayOtraMarcada = false;
      for (let i = 0; i < otrasCondiciones.length; i++) {
        if (otrasCondiciones[i].checked) {
          hayOtraMarcada = true;
          break;
        }
      }
      checkboxNinguna.checked = false;
      checkboxNinguna.disabled = hayOtraMarcada;
      checkboxNinguna.parentElement.classList.toggle("deshabilitada", hayOtraMarcada);
    }
  }

  // Oculta el aviso general si el usuario sigue editando el formulario
  function ocultarMensajeGeneral() {
    mensajeFormulario.hidden = true;
    mensajeFormulario.className = "mensaje-estado";
    mensajeFormulario.textContent = "";
  }

  // Muestra el aviso general de error o éxito al enviar
  function mostrarMensajeGeneral(tipo, texto) {
    mensajeFormulario.className = "mensaje-estado " + tipo;
    mensajeFormulario.textContent = texto;
    mensajeFormulario.hidden = false;
  }

  // Conecta los eventos focus, input, blur y change en cada campo validado
  for (let i = 0; i < camposValidados.length; i++) {
    const campo = document.getElementById(camposValidados[i]);

    if (!campo) {
      continue;
    }

    // Al pulsar/entrar en el campo, mostramos solo sus requisitos
    campo.addEventListener("focus", function () {
      ocultarTodosLosRequisitos();
      const yaTocado = campo.dataset.tocado === "true";
      validarCampo(campo, yaTocado, true);
    });

    // Mientras escribe, actualizamos los requisitos en tiempo real
    campo.addEventListener("input", function () {
      ocultarMensajeGeneral();
      const yaTocado = campo.dataset.tocado === "true";
      validarCampo(campo, yaTocado, true);
    });

    // Al salir del campo o pulsar en otro, actualizamos el borde y ocultamos los requisitos
    campo.addEventListener("blur", function () {
      campo.dataset.tocado = "true";
      validarCampo(campo, true, false);
    });

    // En selects, fechas y checkboxes validamos al cambiar el valor
    if (campo.tagName === "SELECT" || campo.type === "date" || campo.type === "checkbox") {
      campo.addEventListener("change", function () {
        ocultarMensajeGeneral();
        campo.dataset.tocado = "true";
        validarCampo(campo, true, true);
      });
    }
  }

  // Conecta los eventos de los checkboxes de condiciones médicas
  for (let i = 0; i < checkboxesCondiciones.length; i++) {
    checkboxesCondiciones[i].addEventListener("focus", function () {
      ocultarTodosLosRequisitos();
      const yaTocado = grupoCondiciones && grupoCondiciones.dataset.tocado === "true";
      validarGrupoCondiciones(yaTocado, true);
    });

    checkboxesCondiciones[i].addEventListener("change", function (evento) {
      ocultarMensajeGeneral();
      if (grupoCondiciones) {
        grupoCondiciones.dataset.tocado = "true";
      }
      actualizarExclusividadCondiciones(evento.target);
      validarGrupoCondiciones(true, true);
    });
  }

  // Al salir del grupo de condiciones médicas, ocultamos su lista de requisitos
  if (grupoCondiciones) {
    grupoCondiciones.addEventListener("focusout", function (evento) {
      if (!grupoCondiciones.contains(evento.relatedTarget)) {
        grupoCondiciones.dataset.tocado = "true";
        validarGrupoCondiciones(true, false);
      }
    });
  }

  // Comprueba todo el formulario al pulsar "Enviar solicitud"
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    ocultarTodosLosRequisitos();

    let totalErrores = 0;
    let primerCampoConError = null;
    let errorEnCondiciones = false;

    for (let i = 0; i < camposValidados.length; i++) {
      const campo = document.getElementById(camposValidados[i]);
      if (!campo) {
        continue;
      }

      campo.dataset.tocado = "true";
      const esValido = validarCampo(campo, true, false);

      if (!esValido) {
        totalErrores = totalErrores + 1;
        if (!primerCampoConError) {
          primerCampoConError = campo;
        }
      }
    }

    if (grupoCondiciones) {
      grupoCondiciones.dataset.tocado = "true";
    }
    const condicionesValidas = validarGrupoCondiciones(true, false);
    if (!condicionesValidas) {
      totalErrores = totalErrores + 1;
      if (!primerCampoConError && checkboxesCondiciones.length > 0) {
        primerCampoConError = checkboxesCondiciones[0];
        errorEnCondiciones = true;
      }
    }

    if (totalErrores > 0) {
      const textoError =
        totalErrores === 1
          ? "Revisa el formulario: hay 1 campo con errores pendientes."
          : "Revisa el formulario: hay " + totalErrores + " campos con errores pendientes.";

      mostrarMensajeGeneral("error", textoError);

      if (primerCampoConError) {
        primerCampoConError.focus();
        if (errorEnCondiciones) {
          validarGrupoCondiciones(true, true);
        } else {
          validarCampo(primerCampoConError, true, true);
        }
        primerCampoConError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      const nombreUsuario = document.getElementById("nombre").value.trim();
      mostrarMensajeGeneral(
        "exito",
        "¡Solicitud enviada correctamente! Gracias, " +
          nombreUsuario +
          ". Todos los campos han pasado la validación."
      );
      mensajeFormulario.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // Limpia mensajes, estados y bloqueos al pulsar "Limpiar formulario"
  formulario.addEventListener("reset", function () {
    setTimeout(function () {
      ocultarMensajeGeneral();
      ocultarTodosLosRequisitos();

      for (let i = 0; i < camposValidados.length; i++) {
        const campo = document.getElementById(camposValidados[i]);

        if (campo) {
          delete campo.dataset.tocado;
          campo.classList.remove("campo-valido", "campo-invalido");
          campo.removeAttribute("aria-invalid");
          if (campo.type === "checkbox" && campo.parentElement) {
            campo.parentElement.classList.remove("campo-invalido");
          }
        }
      }

      if (grupoCondiciones) {
        delete grupoCondiciones.dataset.tocado;
        grupoCondiciones.classList.remove("campo-invalido");
      }

      for (let i = 0; i < checkboxesCondiciones.length; i++) {
        checkboxesCondiciones[i].disabled = false;
        checkboxesCondiciones[i].parentElement.classList.remove("deshabilitada");
      }
    }, 0);
  });
});
