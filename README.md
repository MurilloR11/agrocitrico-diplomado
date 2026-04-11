# AgroCítrico

Plataforma web de gestión agrícola digital dirigida a agricultores de limón. Permite registrar, planificar y consultar las labores de campo (riego, fertilización, fumigación y cosecha) reemplazando el cuaderno de notas por alertas y registros digitales.

Proyecto académico desarrollado como parte de un Diplomado.

---

## ¿Qué hace el proyecto?

- **Registro de labores**: el agricultor ingresa la fecha de inicio y la frecuencia (cada cuántos días) de cada labor de campo.
- **Cálculo automático de fechas**: el sistema calcula la próxima fecha de cada actividad sin intervención manual.
- **Alertas**: muestra avisos cuando una tarea debe realizarse el mismo día o al día siguiente.
- **Control de cosecha**: registra la cantidad recolectada por fecha y mantiene un historial consultable.
- **Monitoreo con sensores IoT**: integra lecturas de sensores de temperatura, humedad ambiental y humedad del suelo para apoyar la toma de decisiones en campo.

---

## Stack tecnológico

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Python | 3.x | Lenguaje base, lógica de negocio y cálculo de fechas |
| Flask | Latest | Framework web: rutas, servidor y renderizado de vistas |
| Jinja2 | (incluido con Flask) | Motor de plantillas para las vistas HTML |
| MySQL | 8.x | Base de datos relacional para labores, fechas y cosechas |

### Frontend

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica de las vistas |
| CSS3 | Estilos personalizados sin ningún framework externo |
| JavaScript (ES6+) | Interactividad: hamburger menu, scroll spy, scroll reveal, contadores animados |

### APIs y CDNs externos

| Recurso | Uso |
|---|---|
| Google Fonts — Montserrat | Tipografía principal del sitio (pesos 400, 500, 600, 700) |
| devicons CDN (jsDelivr) | Iconos SVG de Python, Flask y MySQL en la sección Tecnologías |
| Unsplash | Imágenes fotográficas de contexto agrícola en las secciones Nosotros y Misión/Visión |

---

## Hardware / Sensores IoT

| Sensor | Variable medida | Descripción |
|---|---|---|
| DHT11 | Temperatura y humedad relativa | Sensor ambiental que registra condiciones climáticas del cultivo |
| DHT11 — Temperatura | °C | Lectura de temperatura en tiempo real para detectar cambios adversos |
| YL69 | Humedad del suelo | Sensor de conductividad eléctrica que indica cuándo regar |

---

## Estructura del proyecto

```
agrocitrico-diplomado/
├── app.py                  # Punto de entrada de Flask y definición de rutas
├── templates/
│   └── index.html          # Vista principal (homepage)
├── static/
│   ├── index.css           # Hoja de estilos principal
│   ├── index.js            # JavaScript del sitio
│   └── img/
│       ├── agrocitrico_logo.svg    # Logotipo del proyecto
│       ├── campesino.png           # Ilustración del agricultor (hero)
│       ├── sensor-dht11.jpg        # Foto del sensor DHT11
│       ├── sensor-temperatura.jpg  # Foto de la medición de temperatura
│       └── sensor-yl69.jpg         # Foto del sensor YL69
└── README.md
```

---

## Secciones de la homepage

| Sección | ID | Descripción |
|---|---|---|
| Hero | `#inicio` | Presentación principal con llamada a la acción |
| Nosotros | `#nosotros` | Descripción de AgroCítrico y estadísticas clave |
| Misión y Visión | `#mision-vision` | Propósito y proyección del proyecto |
| Objetivos | `#objetivos` | Objetivo general y cuatro objetivos específicos |
| Tecnologías | `#tecnologias` | Stack de software: Python, Flask y MySQL |
| Sensores | `#sensores` | Hardware IoT: DHT11 y YL69 |

---

## Funcionalidades del frontend

- **Hamburger menu**: navegación adaptada a móvil con animación de apertura/cierre.
- **Scroll spy**: el enlace activo del nav se actualiza automáticamente según la sección visible.
- **Scroll reveal**: los elementos entran con animación al hacerse visibles en pantalla.
- **Contadores animados**: los números de estadísticas (3 labores, 24h, 100%) se animan al aparecer.
- **Diseño responsive**: adaptado a desktop, tablet y móvil sin ningún framework CSS externo.

---

## Cómo ejecutar el proyecto

**1. Clonar o descargar el repositorio**

**2. Crear y activar el entorno virtual**

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

**3. Instalar dependencias**

```bash
pip install flask
```

**4. Ejecutar la aplicación**

```bash
python app.py
```

**5. Abrir en el navegador**

```
http://localhost:5000
```

---

## Sistema de diseño (CSS)

El CSS usa variables nativas para mantener consistencia visual en todo el sitio:

```css
--green-700: #2E7D32   /* verde oscuro — texto y acentos principales */
--green-600: #388E3C   /* verde — etiquetas y eyebrows */
--green-500: #4CAF50   /* verde medio — decoraciones */
--yellow-500: #F9E04B  /* amarillo — CTA y acentos destacados */
--yellow-600: #E8C820  /* amarillo oscuro — bordes de CTA */
--amber-600:  #F9A825  /* ámbar — etiquetas secundarias */
--line:       #E0E0E0  /* gris — bordes y divisores */
--text:       #1E1E1E  /* texto principal */
--bg:         #FFFFFF  /* fondo base */
```

---

## Estado del proyecto

Proyecto en desarrollo activo como parte de un Diplomado académico.
