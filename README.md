# TP N°08: CRUD de Salas con Node.js, Express y MongoDB

Proyecto desarrollado para la gestión de reservas de salas, implementando una API REST completa y una interfaz web con vistas EJS, conectado a una base de datos MongoDB Atlas.

---

## 🚀 Tecnologías y Entorno
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB Atlas mediante Mongoose
- **Motor de Vistas:** EJS
- **Variables de Entorno:** Configuradas mediante `dotenv` (`PORT`, `NODE_ENV`, `MONGO_URI`)
- **Base de datos predeterminada:** `reservas_salas_u8`

---

## 📂 Estructura por Capas (MVC)
El proyecto se encuentra organizado modularmente para separar responsabilidades:
- `src/app.js`: Configuración principal de Express, conexión asíncrona a MongoDB, manejo de señales de cierre (`SIGINT`/`SIGTERM`) y middlewares de errores.
- `src/routes/`: Enrutadores separados para la interfaz web (`web.routes.js`) y para la API REST (`api.routes.js` montado bajo `/api/reservas`).
- `src/controllers/`: Controladores encargados de procesar peticiones, códigos de estado HTTP y renderizado de vistas o respuestas JSON.
- `src/services/`: Capa de servicios con la lógica de negocio, validaciones estrictas de tipos de entrada y consultas a la base de datos.
- `src/models/`: Esquemas de Mongoose que definen el modelo de datos de las reservas.
- `src/views/`: Plantillas EJS para el frontend y la visualización de estados y formularios.

---

## 📡 Contratos de la API (`/api/reservas`)

| Método | Endpoint | Descripción | Respuestas posibles |
|--------|----------|-------------|---------------------|
| `GET` | `/api/reservas` | Obtiene el listado completo de reservas (soporta filtro opcional `?sala=...`) | `200 OK` (Array JSON) / `400` (Filtro inválido o repetido) |
| `GET` | `/api/reservas/:id` | Obtiene el detalle de una reserva específica por su ID textual | `200 OK` (Objeto JSON) / `400` (ID mal formado) / `404` (No encontrada) |
| `POST` | `/api/reservas` | Crea una nueva reserva validando estrictamente los campos | `201 Created` (Cabecera `Location` y objeto JSON) / `400` (Error de validación) |

---

## 🧪 Pruebas y Resultados Observados (Postman)

1. **Cantidad Inicial y Listado:**
   - Consulta a `GET /api/reservas`: Retorna un `200 OK` con un arreglo JSON con los registros actuales en MongoDB Atlas.

2. **Creación y Representación del ID (`POST`):**
   - Se envía una petición `POST` a `/api/reservas` con un cuerpo válido.
   - **Respuesta:** Código `201 Created`. La cabecera HTTP `Location` devuelve la ruta exacta del recurso creado (ej: `/api/reservas/65d1a2b3c4...`). El objeto retornado transforma el `_id` nativo de MongoDB a una propiedad textual `id`.

3. **Prueba de Reinicio y Persistencia:**
   - Se detiene el servidor Node.js (simulando corte o reinicio con Ctrl+C) y se vuelve a iniciar.
   - Al consultar `GET /api/reservas/{id}` con el ID guardado previamente (sin repetir el `POST`), el recurso se recupera de forma idéntica, demostrando la persistencia en MongoDB Atlas.

4. **Casos Negativos (Sin Escritura en BD):**
   - Envíos de `POST` con campos faltantes, tipos inválidos (ej. `personas: "texto"` o `personas: 0`) devuelven estrictamente un `400 Bad Request` y **no realizan ninguna escritura** en la base de datos.
   - Consultas con parámetros de sala vacíos (`?sala=`) procesan el `trim`, eliminan el filtro nulo y devuelven la totalidad de las reservas con normalidad (`200 OK`).

---

## 🔄 Comparativa con TP07
- A diferencia del TP07 (que utilizaba almacenamiento local basado en archivos JSON mediante `fs/promises`), este trabajo práctico implementa una arquitectura robusta basada en una base de datos documental con **MongoDB Atlas y Mongoose**, incorporando validaciones estrictas en capa de servicio, manejo de errores tipados y un cierre de servidor ordenado (`graceful shutdown`).