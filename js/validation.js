/* ============================================================
   FUNCIONES DE VALIDACIÓN POR CAMPO
   Cada función devuelve una lista de requisitos con:
   - texto: descripción breve del requisito
   - cumplido: true (verde), false (pendiente/rojo) o null (opcional vacío)
   ============================================================ */

// Calcula la edad exacta en años a partir de una fecha YYYY-MM-DD
function calcularEdad(fechaTexto) {
  const nacimiento = new Date(fechaTexto + "T00:00:00");

  if (isNaN(nacimiento.getTime())) {
    return -1;
  }

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();

  if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad = edad - 1;
  }

  return edad;
}

// Cuenta cuántas palabras reales (al menos 2 letras) contiene un texto
function contarPalabras(texto) {
  const partes = texto.trim().split(/\s+/);
  let total = 0;

  for (let i = 0; i < partes.length; i++) {
    if (/[A-Za-zÁÉÍÓÚáéíóúÑñÜü]{2,}/.test(partes[i])) {
      total = total + 1;
    }
  }

  return total;
}

function validarNombre(valor) {
  const texto = valor.trim();
  const tieneTexto = texto.length > 0;
  const longitudCorrecta = texto.length >= 2 && texto.length <= 40;
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(texto);

  return [
    { texto: "Campo obligatorio", cumplido: tieneTexto },
    { texto: "Entre 2 y 40 caracteres", cumplido: longitudCorrecta },
    { texto: "Solo letras y espacios", cumplido: tieneTexto && soloLetras }
  ];
}

function validarApellidos(valor) {
  const texto = valor.trim();
  const tieneTexto = texto.length > 0;
  const longitudCorrecta = texto.length >= 2 && texto.length <= 80;
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(texto);

  return [
    { texto: "Campo obligatorio", cumplido: tieneTexto },
    { texto: "Entre 2 y 80 caracteres", cumplido: longitudCorrecta },
    { texto: "Solo letras y espacios", cumplido: tieneTexto && soloLetras }
  ];
}

function validarDni(valor) {
  const texto = valor.trim().toUpperCase();
  const tieneTexto = texto.length > 0;
  const nueveCaracteres = texto.length === 9;
  const formatoValido = /^([0-9]{8}|[XYZ][0-9]{7})[A-Z]$/.test(texto);

  return [
    { texto: "Campo obligatorio", cumplido: tieneTexto },
    { texto: "Exactamente 9 caracteres", cumplido: nueveCaracteres },
    { texto: "Formato DNI (12345678Z) o NIE (X1234567L)", cumplido: formatoValido }
  ];
}

function validarFechaNacimiento(valor) {
  const tieneFecha = valor.trim() !== "";
  let edadValida = false;

  if (tieneFecha) {
    const edad = calcularEdad(valor);
    edadValida = edad >= 16 && edad < 120;
  }

  return [
    { texto: "Campo obligatorio", cumplido: tieneFecha },
    { texto: "Edad mínima de 16 años (y menor de 120)", cumplido: edadValida }
  ];
}

function validarEmail(valor) {
  const texto = valor.trim();
  const tieneTexto = texto.length > 0;
  const sinEspacios = tieneTexto && !/\s/.test(texto);
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto);

  return [
    { texto: "Campo obligatorio", cumplido: tieneTexto },
    { texto: "Sin espacios en blanco", cumplido: sinEspacios },
    { texto: "Formato válido (ejemplo@correo.com)", cumplido: formatoValido }
  ];
}

function validarTelefono(valor) {
  const texto = valor.trim();
  const tieneTexto = texto.length > 0;
  const caracteresValidos = /^\+?[0-9\s-]+$/.test(texto);
  const soloDigitos = texto.replace(/\D/g, "");
  const cantidadDigitos = soloDigitos.length >= 9 && soloDigitos.length <= 15;

  return [
    { texto: "Campo obligatorio", cumplido: tieneTexto },
    { texto: "Solo números (se permite + al inicio, espacios o guiones)", cumplido: tieneTexto && caracteresValidos },
    { texto: "Entre 9 y 15 dígitos", cumplido: cantidadDigitos }
  ];
}

function validarDireccion(valor) {
  const texto = valor.trim();
  const tieneTexto = texto.length > 0;
  const longitudCorrecta = texto.length >= 5 && texto.length <= 120;

  return [
    { texto: "Campo obligatorio", cumplido: tieneTexto },
    { texto: "Entre 5 y 120 caracteres", cumplido: longitudCorrecta }
  ];
}

function validarCiudad(valor) {
  const texto = valor.trim();
  const tieneTexto = texto.length > 0;
  const longitudCorrecta = texto.length >= 2 && texto.length <= 60;
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(texto);

  return [
    { texto: "Campo obligatorio", cumplido: tieneTexto },
    { texto: "Entre 2 y 60 caracteres", cumplido: longitudCorrecta },
    { texto: "Solo letras y espacios", cumplido: tieneTexto && soloLetras }
  ];
}

function validarCodigoPostal(valor) {
  const texto = valor.trim();
  const tieneTexto = texto.length > 0;
  const soloNumeros = /^[0-9]+$/.test(texto);
  const cincoDigitos = /^[0-9]{5}$/.test(texto);

  return [
    { texto: "Campo obligatorio", cumplido: tieneTexto },
    { texto: "Solo dígitos numéricos", cumplido: tieneTexto && soloNumeros },
    { texto: "Exactamente 5 dígitos (ej. 28001)", cumplido: cincoDigitos }
  ];
}

function validarAltura(valor, entradaInvalida) {
  const tieneValor = valor.trim() !== "" && !entradaInvalida;
  const numero = Number(valor);
  const rangoValido = tieneValor && !isNaN(numero) && numero >= 120 && numero <= 230;
  const esEntero = tieneValor && Number.isInteger(numero);

  return [
    { texto: "Campo obligatorio", cumplido: tieneValor },
    { texto: "Valor entre 120 y 230 cm", cumplido: rangoValido },
    { texto: "Número entero (sin decimales)", cumplido: esEntero }
  ];
}

function validarPeso(valor, entradaInvalida) {
  const tieneValor = valor.trim() !== "" && !entradaInvalida;
  const numero = Number(valor);
  const rangoValido = tieneValor && !isNaN(numero) && numero >= 35 && numero <= 250;

  return [
    { texto: "Campo obligatorio", cumplido: tieneValor },
    { texto: "Valor entre 35 y 250 kg (admite decimales)", cumplido: rangoValido }
  ];
}

function validarCondicionesMedicas(checkboxes) {
  let algunaMarcada = false;

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      algunaMarcada = true;
      break;
    }
  }

  return [
    { texto: 'Selecciona al menos una opción (o marca "Ninguna")', cumplido: algunaMarcada }
  ];
}

function validarObjetivos(valor) {
  const texto = valor.trim();
  const tieneTexto = texto.length > 0;
  const suficientesPalabras = contarPalabras(texto) >= 3;
  const longitudMaxima = tieneTexto && texto.length <= 500;

  return [
    { texto: "Campo obligatorio", cumplido: tieneTexto },
    { texto: "Escribe al menos 3 palabras", cumplido: suficientesPalabras },
    { texto: "Máximo 500 caracteres", cumplido: longitudMaxima }
  ];
}

function validarPlan(valor) {
  return [
    { texto: "Selecciona un plan de membresía", cumplido: valor !== "" }
  ];
}

function validarFranjaHoraria(valor) {
  return [
    { texto: "Selecciona una franja horaria", cumplido: valor !== "" }
  ];
}

function validarNifFactura(valor) {
  const texto = valor.trim().toUpperCase();

  // Al ser opcional, si queda vacío no genera error
  if (texto === "") {
    return [
      { texto: "Campo opcional (déjalo vacío si coincide con tu DNI)", cumplido: null }
    ];
  }

  const formatoValido = /^([0-9]{8}[A-Z]|[A-Z][0-9]{7}[0-9A-Z])$/.test(texto);

  return [
    { texto: "Exactamente 9 caracteres", cumplido: texto.length === 9 },
    { texto: "Formato NIF, NIE o CIF válido (ej. B12345678)", cumplido: formatoValido }
  ];
}

function validarIban(valor) {
  const texto = valor.trim();
  const tieneTexto = texto.length > 0;
  const soloNumeros = /^[0-9]+$/.test(texto);
  const cuatroDigitos = /^[0-9]{4}$/.test(texto);

  return [
    { texto: "Campo obligatorio", cumplido: tieneTexto },
    { texto: "Solo dígitos numéricos", cumplido: tieneTexto && soloNumeros },
    { texto: "Exactamente 4 dígitos (ej. 1234)", cumplido: cuatroDigitos }
  ];
}

function validarTerminos(marcado) {
  return [
    { texto: "Debes aceptar los términos y condiciones", cumplido: marcado }
  ];
}

function validarPrivacidad(marcado) {
  return [
    { texto: "Debes autorizar la política de privacidad", cumplido: marcado }
  ];
}

// Comprueba si todos los requisitos de una lista se cumplen
function todosRequisitosCumplidos(requisitos) {
  for (let i = 0; i < requisitos.length; i++) {
    if (requisitos[i].cumplido === false) {
      return false;
    }
  }
  return true;
}
