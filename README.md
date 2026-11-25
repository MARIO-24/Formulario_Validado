# Formulario Validado — Inscripción al Gimnasio

Proyecto educativo que implementa un formulario completo de inscripción a un gimnasio con **validación en tiempo real** y un diseño minimalista inspirado en las aplicaciones de Google.

Está desarrollado como versión propia tomando como referencia el repositorio [ValidacionDeFormularios](https://github.com/sulbaranjc/ValidacionDeFormularios), priorizando un código sencillo, claro y fácil de explicar.

---

## Tecnologías utilizadas

- **HTML5**: estructura semántica del formulario y atributos nativos de validación (`required`, `minlength`, `maxlength`, `min`, `max`, `pattern`, `type="email"`, `type="date"`, `type="number"`).
- **CSS3**: diseño limpio con fondo gris claro, tarjeta blanca, bordes suaves, botones azules y rejilla adaptable (responsive) para móvil y ordenador.
- **JavaScript puro**: funciones pequeñas y legibles para validar cada campo y actualizar la interfaz sin librerías ni frameworks externos.

---

## Estructura del proyecto

```text
Formulario_Validado/
├── index.html          # Estructura del formulario con los 9 apartados
├── css/
│   └── styles.css      # Estilos minimalistas y diseño responsive
├── js/
│   ├── validation.js   # Funciones individuales de validación por campo
│   └── main.js         # Eventos del formulario y actualización visual
└── README.md           # Documentación del proyecto
```

---

## Cómo abrir el proyecto

No requiere instalación ni dependencias externas.

1. Clona o descarga este repositorio:
   ```bash
   git clone https://github.com/MARIO-24/Formulario_Validado.git
   ```
2. Entra en la carpeta `Formulario_Validado`.
3. Abre el archivo `index.html` haciendo doble clic sobre él en tu navegador (Chrome, Edge, Firefox, Safari).

También puedes abrirlo con la extensión **Live Server** de Visual Studio Code si lo prefieres.

---

## Apartados y validaciones incluidas

El formulario conserva los apartados principales del proyecto de referencia, diferenciando claramente los campos obligatorios (`*`) de los opcionales:

1. **Datos personales**
   - **Nombre y apellidos** (obligatorios): longitud controlada (`minlength` / `maxlength`) y solo letras y espacios.
   - **DNI / NIE** (obligatorio): expresión regular para validar 9 caracteres con formato DNI (`12345678Z`) o NIE (`X1234567L`).
   - **Fecha de nacimiento** (obligatoria): cálculo exacto de edad para exigir un mínimo de **16 años** (y menor de 120).
   - **Sexo y estado civil**: campos opcionales.
2. **Información de contacto**
   - **Correo electrónico** (obligatorio): `type="email"`, sin espacios y con formato válido (`usuario@dominio.ext`).
   - **Teléfono móvil** (obligatorio): expresión regular que admite dígitos, prefijo `+`, espacios o guiones, con un total de 9 a 15 dígitos.
   - **Preferencia de contacto**: opción por defecto (opcional cambiarla).
3. **Dirección**
   - **Dirección** (obligatoria): entre 5 y 120 caracteres.
   - **Ciudad** (obligatoria): entre 2 y 60 caracteres, solo letras y espacios.
   - **Código postal** (obligatorio): expresión regular para exigir exactamente **5 dígitos** (`28001`).
4. **Información médica**
   - **Altura** (obligatoria): número entero entre **120 y 230 cm**.
   - **Peso** (obligatorio): número entre **35 y 250 kg** (admite decimales).
   - **Nivel de actividad**: opcional.
   - **Condiciones médicas** (obligatorio elegir al menos una): si se marca *Ninguna*, se deshabilitan las demás opciones automáticamente, y viceversa.
5. **Objetivos deportivos**
   - **Objetivos principales** (obligatorio): requiere escribir al menos **3 palabras** y un máximo de 500 caracteres.
6. **Tipo de membresía**
   - **Plan de membresía** (obligatorio): selección válida en el desplegable (`<select>`).
   - **¿Quién te refirió?**: opcional.
7. **Horarios**
   - **Franja horaria preferida** (obligatoria): selección válida en el desplegable (`<select>`).
   - **Días preferidos y clases grupales**: opcionales.
8. **Facturación**
   - **NIF / NIE para factura** (opcional): si se deja vacío es válido; si se rellena, valida formato NIF, NIE o CIF de 9 caracteres.
   - **Dirección de facturación**: opcional.
   - **IBAN (últimos 4 dígitos)** (obligatorio): expresión regular de exactamente **4 dígitos numéricos**.
9. **Consentimientos**
   - **Términos y condiciones** y **Política de privacidad (RGPD)**: casillas obligatorias.
   - **Comunicaciones promocionales**: casilla opcional.

---

## Cómo funciona la validación en tiempo real

El archivo `js/validation.js` contiene una función pequeña por cada campo (por ejemplo, `validarEmail`, `validarDni` o `validarFechaNacimiento`). Cada función devuelve una lista de requisitos indicando si se cumplen o no.

El archivo `js/main.js` escucha los eventos `focus`, `input`, `blur`, `focusout`, `change`, `submit` y `reset`:

- Al **pulsar en un campo**, aparece debajo su lista de requisitos actualizada en tiempo real:
  - **Gris (`•`)**: requisito pendiente mientras el usuario escribe por primera vez.
  - **Verde (`✓`)**: requisito cumplido correctamente.
  - **Rojo (`✕`)**: requisito incumplido después de salir del campo (`blur`), cambiar una selección (`change`) o intentar enviar el formulario (`submit`).
- Al **salir del campo o pulsar en otro**, la lista de requisitos se oculta automáticamente y el campo conserva su borde verde o rojo para indicar su estado.
- Al pulsar **Enviar solicitud**:
  1. Se comprueban todos los campos a la vez.
  2. Si falta algún requisito, se impide el envío, los campos con error quedan marcados en rojo y el foco salta al primer campo pendiente mostrando sus requisitos.
  3. Si todo está correcto, se muestra un mensaje de confirmación en verde.
