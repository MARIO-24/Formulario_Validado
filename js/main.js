/* ============================================================
   CONTROL DEL FORMULARIO Y VALIDACIÓN EN TIEMPO REAL
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario-inscripcion");
  const mensajeFormulario = document.getElementById("mensaje-formulario");
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

  // Dibuja la lista de requisitos debajo de un campo con su estado visual
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

  // Aplica el borde verde o rojo al campo según su validez
  function actualizarEstiloCampo(campo, esValido, mostrarErrores, esOpcionalVacio) {
    if (campo.type === "checkbox") {
      if (!esValido && mostrarErrores) {
        campo.setAttribute("aria-invalid", "true");
      } else {
        campo.removeAttribute("aria-invalid");
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

  // Valida un campo concreto, pinta sus requisitos y devuelve true o false
  function validarCampo(campo, mostrarErrores) {
    const lista = document.getElementById("req-" + campo.id);
    const requisitos = obtenerRequisitosCampo(campo);
    const esValido = todosRequisitosCumplidos(requisitos);
    const esOpcionalVacio = requisitos.length === 1 && requisitos[0].cumplido === null;

    if (esOpcionalVacio && document.activeElement !== campo) {
      if (lista) {
        lista.classList.remove("visible");
        lista.innerHTML = "";
      }
    } else {
      mostrarRequisitos(lista, requisitos, mostrarErrores);
    }

    actualizarEstiloCampo(campo, esValido, mostrarErrores, esOpcionalVacio);

    return esValido;
  }

  // Valida el grupo de checkboxes de condiciones médicas
  function validarGrupoCondiciones(mostrarErrores) {
    const lista = document.getElementById("req-condiciones");
    const requisitos = validarCondicionesMedicas(checkboxesCondiciones);
    const esValido = todosRequisitosCumplidos(requisitos);

    mostrarRequisitos(lista, requisitos, mostrarErrores);
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

    campo.addEventListener("focus", function () {
      const yaTocado = campo.dataset.tocado === "true";
      validarCampo(campo, yaTocado);
    });

    campo.addEventListener("input", function () {
      ocultarMensajeGeneral();
      const yaTocado = campo.dataset.tocado === "true";
      validarCampo(campo, yaTocado);
    });

    campo.addEventListener("blur", function () {
      campo.dataset.tocado = "true";
      validarCampo(campo, true);
    });

    // En selects, fechas y checkboxes validamos al cambiar el valor
    if (campo.tagName === "SELECT" || campo.type === "date" || campo.type === "checkbox") {
      campo.addEventListener("change", function () {
        ocultarMensajeGeneral();
        campo.dataset.tocado = "true";
        validarCampo(campo, true);
      });
    }
  }

  // Conecta los eventos de los checkboxes de condiciones médicas
  for (let i = 0; i < checkboxesCondiciones.length; i++) {
    checkboxesCondiciones[i].addEventListener("change", function (evento) {
      ocultarMensajeGeneral();
      actualizarExclusividadCondiciones(evento.target);
      validarGrupoCondiciones(true);
    });
  }

  // Comprueba todo el formulario al pulsar "Enviar solicitud"
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let totalErrores = 0;
    let primerCampoConError = null;

    for (let i = 0; i < camposValidados.length; i++) {
      const campo = document.getElementById(camposValidados[i]);
      if (!campo) {
        continue;
      }

      campo.dataset.tocado = "true";
      const esValido = validarCampo(campo, true);

      if (!esValido) {
        totalErrores = totalErrores + 1;
        if (!primerCampoConError) {
          primerCampoConError = campo;
        }
      }
    }

    const condicionesValidas = validarGrupoCondiciones(true);
    if (!condicionesValidas) {
      totalErrores = totalErrores + 1;
      if (!primerCampoConError && checkboxesCondiciones.length > 0) {
        primerCampoConError = checkboxesCondiciones[0];
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

      for (let i = 0; i < camposValidados.length; i++) {
        const campo = document.getElementById(camposValidados[i]);
        const lista = document.getElementById("req-" + camposValidados[i]);

        if (campo) {
          delete campo.dataset.tocado;
          campo.classList.remove("campo-valido", "campo-invalido");
          campo.removeAttribute("aria-invalid");
        }

        if (lista) {
          lista.classList.remove("visible");
          lista.innerHTML = "";
        }
      }

      const listaCondiciones = document.getElementById("req-condiciones");
      if (listaCondiciones) {
        listaCondiciones.classList.remove("visible");
        listaCondiciones.innerHTML = "";
      }

      for (let i = 0; i < checkboxesCondiciones.length; i++) {
        checkboxesCondiciones[i].disabled = false;
        checkboxesCondiciones[i].parentElement.classList.remove("deshabilitada");
      }
    }, 0);
  });
});
