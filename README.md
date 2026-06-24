# Parcial 2 - Gestión de Cursos

Este proyecto consta de un Backend (Node.js + Express + SQL Server) y un Frontend (HTML/CSS/JS nativo).

## Requisitos Previos
1. Node.js instalado.
2. SQL Server (con TCP/IP habilitado en el puerto 1433 si se usa `tedious` u ODBC configurado).
3. Base de datos creada con la siguiente estructura:

```sql
CREATE DATABASE CursosDB;
GO
USE CursosDB;
GO
CREATE TABLE Cursos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100),
    Categoria NVARCHAR(100),
    Duracion INT,
    CuposDisponibles INT,
    Activo BIT
);
```

## Configuración del Backend

1. Abre la terminal en la carpeta `backend` y ejecuta:
   ```bash
   npm install
   ```

2. Configura las variables de entorno:
   - En la carpeta `backend`, renombra el archivo `.env.example` a `.env` (o crea una copia).
   - Abre el archivo `.env` y coloca los datos de tu conexión de SQL Server (usuario, contraseña, servidor, etc.).

3. Inicia el servidor:
   ```bash
   npm run dev
   ```
   El servidor arrancará en `http://localhost:3000`.

## Uso del Frontend

El frontend no requiere de Node.js ni de ningún servidor local para ejecutarse.
1. Dirígete a la carpeta `frontend`.
2. Haz doble clic en el archivo `index.html` para abrirlo directamente en tu navegador (Chrome, Edge, etc.).
3. Desde ahí podrás probar todo el CRUD (crear, listar, actualizar estado, ver detalles y eliminar).
