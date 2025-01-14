# 🔄 **API Rest Truequecito**

API REST para una plataforma de **intercambio de productos (trueques)** que permite a los usuarios registrarse, publicar productos, realizar intercambios, y gestionar su perfil de manera eficiente y segura.

---

## 📝 **Descripción**

**Truequecito API** ofrece funcionalidades robustas para manejar autenticación, usuarios, productos, intercambios, notificaciones, y administración. Diseñado para ser escalable, seguro y fácil de integrar con clientes frontend.

---

## 🚀 **Características Principales**

### 🔐 **Autenticación**
- Registro y login de usuarios.  
- Integración con **OAuth** (Google y Discord).  
- **JWT** para manejo seguro de sesiones.  
- Middleware para autenticación y control de roles.

### 👥 **Usuarios**
- Gestión de perfil (actualización de datos, avatar personalizado).  
- **Sistema de seguidores**: seguir/desseguir usuarios.  
- **Sistema de likes** en perfiles y productos.  
- Reputación basada en intercambios realizados.

### 📦 **Productos**
- **CRUD completo** para gestionar productos.  
- Búsqueda y filtrado.  
- **Imágenes múltiples** por producto.  
- Gestión de estado (nuevo/usado) y preferencias.  
- Sistema de aprobación para publicaciones.

### 🤝 **Intercambios**
- Propuestas de intercambio entre usuarios.  
- Estados de intercambio: **pendiente**, **aceptado**, **rechazado**, **completado**.  
- Generación de **comprobantes de intercambio**.  
- **Códigos únicos** por cada intercambio.  
- **Notificaciones** en tiempo real sobre el estado de los intercambios.

### 📬 **Notificaciones**
- Sistema en tiempo real para notificar cambios en productos, intercambios, y seguidores.  
- Historial y marcado de notificaciones como leídas.

### 👨‍💼 **Panel Administrativo**
- Gestión de usuarios, productos y roles.  
- Estadísticas completas de intercambios y actividades.  

---

## 🛠 **Tecnologías Utilizadas**

### **Backend**
- **Node.js**  
- **Express.js**  
- **MongoDB** + **Mongoose**  
- **JWT** para autenticación.  
- **Passport.js** para OAuth (Google, Discord).  
- **Multer** para manejo de archivos.  
- **Bcrypt** para encriptación de contraseñas.  

---

## 📂 **Estructura del Proyecto**

```plaintext
api-rest-truequecito/
├── admin/
│   ├── controllers/
│   ├── middleware/
│   └── routes/
├── config/
│   ├── db.js
│   └── passport.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── strategy/
├── uploads/
├── utils/
└── server.js
```
## 📊 **Modelos de Datos **
## **User**
- Información personal.
- Autenticación (contraseñas seguras).
- Gestión de productos, seguidores, y likes.
- Sistema de reputación basado en intercambios.
## **Product**
- Título, descripción, imágenes, estado y preferencias.
- Sistema de aprobación.
- Exchange
- Usuarios involucrados en el intercambio.
- Estado del intercambio.
- Comprobantes generados con códigos únicos.
- Notification
- Usuario destinatario.
- Mensaje, estado de lectura, y timestamp.
## 🌐 **Endpoints Principales**
## Autenticación
- POST /api/auth/register - Registro de usuario.
- POST /api/auth/login - Login de usuario.
- GET /api/auth/google - Autenticación con Google.
- GET /api/auth/discord - Autenticación con Discord.
## Productos
- GET /api/products - Listar todos los productos.
- POST /api/products - Crear un producto.
- GET /api/products/:id - Ver detalles de un producto.
- PUT /api/products/:id - Actualizar un producto.
- DELETE /api/products/:id - Eliminar un producto.
## Intercambios
- POST /api/exchanges - Crear una propuesta de intercambio.
- GET /api/exchanges/all - Listar todos los intercambios.
- GET /api/exchanges/completed - Ver intercambios completados.
- PUT /api/exchanges/status - Actualizar el estado de un intercambio.
## Usuarios
- GET /api/user/:userId - Ver perfil de un usuario.
- POST /api/user/:userId/follow - Seguir/desseguir usuario.
- POST /api/user/:userId/like - Dar like a un usuario.
- PUT /api/user/profile - Actualizar perfil de usuario.

## 🔑 Variables de Entorno
- Crea un archivo .env con las siguientes claves:

````plaintext
Copiar código
MONGO_URI=<tu-uri-de-mongodb>
JWT_SECRET=<tu-secreto-jwt>
GOOGLE_CLIENT_ID=<tu-client-id-google>
GOOGLE_CLIENT_SECRET=<tu-client-secret-google>
DISCORD_CLIENT_ID=<tu-client-id-discord>
DISCORD_CLIENT_SECRET=<tu-client-secret-discord>
SESSION_SECRET=<tu-session-secret>
