# AgroCítrico

AgroCítrico es una plataforma web académica para la gestión agrícola de cultivos de limón. Permite mostrar información del proyecto, registrar usuarios, iniciar sesión, acceder a un dashboard protegido y consultar un asistente de IA local con GPT4All.

## Funcionalidades actuales

- Homepage informativa con secciones de objetivos, tecnologías, sensores y contexto del proyecto.
- Registro de usuarios con validación del lado cliente y servidor.
- Login con contraseñas protegidas mediante hash.
- Middleware de sesión:
  - Usuarios sin sesión no pueden acceder a `/dashboard`.
  - Usuarios logueados no pueden volver a `/login` ni `/register`.
- Dashboard privado con resumen de labores, alertas, sensores IoT y cosecha.
- Asistente IA en `/ia` conectado a GPT4All.
- Migraciones de base de datos con Flask-Migrate/Alembic.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Python 3, Flask, Flask-SQLAlchemy, Flask-Migrate |
| Base de datos | MySQL, PyMySQL |
| Frontend | HTML5, Jinja2, CSS3, JavaScript |
| IA local | GPT4All con `Meta-Llama-3-8B-Instruct.Q4_0.gguf` |

## Estructura del proyecto

```text
agrocitrico-diplomado/
├── app.py                         # App principal, rutas, modelos y middleware
├── requirements.txt               # Dependencias Python
├── migrations/                    # Configuración y versiones de Flask-Migrate
│   └── versions/
│       └── d1ba8446358a_create_users_table.py
├── templates/
│   ├── index.html                 # Homepage
│   ├── login.html                 # Inicio de sesión
│   ├── register.html              # Registro de usuarios
│   ├── dashboard.html             # Panel privado
│   └── ia.html                    # Asistente IA
└── static/
    ├── index.css
    ├── index.js
    ├── css/                       # Estilos por pantalla
    ├── js/                        # Scripts por pantalla
    └── img/                       # Logo e imágenes del proyecto
```

## Configuración en otro equipo

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd agrocitrico-diplomado
```

2. Crear y activar el entorno virtual:

```bash
python3 -m venv venv
source venv/bin/activate
```

En Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

3. Instalar dependencias:

```bash
pip install -r requirements.txt
```

4. Crear la base de datos MySQL vacía:

```sql
CREATE DATABASE agrocitrico CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Configurar conexión a MySQL.

Por defecto la app intenta conectar a:

```text
mysql+pymysql://root@localhost:3306/agrocitrico
```

Si tu MySQL usa otro usuario o contraseña, exporta variables antes de migrar o ejecutar:

```bash
export MYSQL_USER="root"
export MYSQL_PASSWORD="tu_password"
export MYSQL_HOST="localhost"
export MYSQL_PORT="3306"
export MYSQL_DATABASE="agrocitrico"
export SECRET_KEY="cambia-esta-clave"
```

También puedes usar una URL completa:

```bash
export DATABASE_URL="mysql+pymysql://usuario:password@localhost:3306/agrocitrico"
```

## Migraciones de base de datos

Aplicar las migraciones existentes:

```bash
flask db upgrade
```

Ver la revisión actual aplicada:

```bash
flask db current
```

Crear una nueva migración después de cambiar modelos:

```bash
flask db migrate -m "descripcion del cambio"
flask db upgrade
```

La migración actual crea la tabla `users` con nombre completo, correo único, hash de contraseña y fechas de creación/actualización.

## Ejecutar el proyecto

Con el entorno virtual activo:

```bash
python app.py
```

Abrir en el navegador:

```text
http://localhost:5000
```

Si el puerto 5000 está ocupado:

```bash
flask run --host 127.0.0.1 --port 5001
```

## Rutas principales

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Homepage |
| `/register` | Solo visitantes | Registro |
| `/login` | Solo visitantes | Inicio de sesión |
| `/dashboard` | Solo usuarios logueados | Dashboard privado |
| `/ia` | Público actualmente | Asistente IA |
| `/ia/chat` | POST | Endpoint del modelo GPT4All |
| `/logout` | POST | Cierre de sesión |

## Asistente IA

El asistente usa:

```python
GPT4All("Meta-Llama-3-8B-Instruct.Q4_0.gguf")
```

La primera consulta puede tardar porque GPT4All descarga o carga un modelo de varios GB. No subas archivos `.gguf` al repositorio; están excluidos por `.gitignore`.

## Comandos útiles

```bash
venv/bin/python -m py_compile app.py
venv/bin/flask routes
venv/bin/flask db current
```

## Notas de seguridad

- No subas `.env`, contraseñas, dumps de base de datos ni modelos locales.
- Cambia `SECRET_KEY` en producción.
- Usa `debug=True` solo en desarrollo local.
- Las contraseñas se guardan como hash, no en texto plano.

## Estado del proyecto

Proyecto académico en desarrollo activo como parte de un Diplomado.
