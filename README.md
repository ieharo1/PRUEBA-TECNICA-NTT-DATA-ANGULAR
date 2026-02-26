# prueba-tecnica-ntt

Proyecto para prueba técnica de NTT - Aplicación de Gestión de Productos.

---

## 📝 Descripción

Aplicación fullstack desarrollada como prueba técnica para NTT. Es un sistema de gestión de productos que permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) con las siguientes características:

- **Frontend**: Angular 18 con diseño responsive y moderno
- **Backend**: Node.js/Express con TypeScript
- **Estilos**: SCSS con gradientes y animaciones

---

## 🎯 Funcionalidades

- Listar productos con búsqueda en tiempo real
- Paginación de resultados (5, 10, 20 items)
- Agregar nuevos productos con validación
- Editar productos existentes
- Eliminar productos con confirmación
- Verificar disponibilidad de ID antes de registrar
- Diseño responsive y moderno

---

## 🏗 Estructura del Proyecto

```
prueba-tecnica-ntt/
├── frontend/                 # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Componentes (product-list, add-product, edit-product)
│   │   │   ├── models/     # Modelos de datos
│   │   │   └── services/   # Servicios HTTP
│   │   ├── styles.scss     # Estilos globales
│   │   └── main.ts         # Punto de entrada
│   ├── angular.json        # Configuración Angular
│   └── package.json        # Dependencias
│
├── backend/                  # API REST Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── interfaces/     # TypeScript interfaces
│   │   └── main.ts         # Punto de entrada
│   ├── package.json        # Dependencias
│   └── tsconfig.json       # Configuración TypeScript
│
└── README.md
```

---

## 🚀 Cómo Levantar el Proyecto

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### 1. Instalar Dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Ejecutar el Backend

```bash
cd backend
npm run start:dev
```

El backend se ejecutará en: `http://localhost:3002`

### 3. Ejecutar el Frontend

```bash
cd frontend
npm start
```

El frontend se ejecutará en: `http://localhost:4200`

### 4. Usar la Aplicación

1. Asegúrate de que el backend esté corriendo en el puerto 3002
2. Inicia el frontend en el puerto 4200
3. Abre tu navegador en `http://localhost:4200`

---

## 🌐 Desplegar en GitHub Pages

### Prérequisitos

1. Tener una cuenta de GitHub
2. Tener el proyecto en un repositorio de GitHub

### Pasos para el Despliegue

1. **Compilar el proyecto para producción:**
```bash
cd frontend
npm run build
```

2. **Instalar angular-cli-ghpages si no lo tienes:**
```bash
npm install -g angular-cli-ghpages
```

3. **Desplegar a GitHub Pages:**
```bash
npx angular-cli-ghpages --dir=dist/frontend
```

O si prefieres usar el comando directo:
```bash
ngh --dir=dist/frontend
```

4. **Configurar el repositorio remoto (si no lo has hecho):**
```bash
git remote add origin https://github.com/TU_USUARIO/prueba-tecnica-ntt.git
```

5. **Hacer push de los cambios:**
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Nota Importante

La aplicación en GitHub Pages es solo el frontend. El backend debe estar corriendo localmente o desplegado en un servidor. Para un funcionamiento completo, necesitas:

- **Opción 1**: Desplegar también el backend (requiere un servicio como Render, Railway, o Heroku)
- **Opción 2**: Modificar el servicio del frontend para usar una API externa

---

## 📡 Endpoints del Backend

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/bp/products` | Obtener todos los productos |
| GET | `/bp/products/:id` | Obtener un producto por ID |
| POST | `/bp/products` | Crear un nuevo producto |
| PUT | `/bp/products/:id` | Actualizar un producto |
| DELETE | `/bp/products/:id` | Eliminar un producto |
| GET | `/bp/products/verification/:id` | Verificar si un ID está disponible |

---

## 🛠 Stack Tecnológico

### Frontend
- Angular 18
- TypeScript
- SCSS
- RxJS
- Angular Router

### Backend
- Node.js
- Express
- TypeScript
- routing-controllers
- class-validator
- reflect-metadata

---

## 🎨 Características del Diseño

- Tema oscuro en footer con gradiente
- Botones con gradientes y sombras
- Tablas con hover effects
- Modal de confirmación con animaciones
- Diseño responsive para móviles
- Validación de formularios en tiempo real

---

## 👨‍💻 Desarrollado por Isaac Esteban Haro Torres

**Ingeniero en Sistemas · Full Stack · Automatización · Data**

- 📧 Email: zackharo1@gmail.com
- 📱 WhatsApp: 098805517
- 💻 GitHub: https://github.com/ieharo1
- 🌐 Portafolio: https://ieharo1.github.io/portafolio-isaac.haro/

---

© 2026 Isaac Esteban Haro Torres - Todos los derechos reservados.
