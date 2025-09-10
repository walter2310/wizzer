# Requisitos para Correr el Servidor

Para ejecutar el servidor localmente, asegúrate de cumplir con los siguientes requisitos:

- **Node.js**: Asegúrate de tener Node.js instalado. La versión utilizada en este proyecto es la 20.12.2.
- **Nest.js**: Asegúrate de tener Nest.js instalado.
- **Docker**: Es necesario tener Docker instalado para levantar los contenedores del proyecto.
- **Contenedores Docker necesarios**:
  - PostgreSQL: `docker pull postgres:15.3`
  - pgAdmin 4 (opcional): `docker pull dpage/pgadmin4`


# Pasos para Inicializar el Proyecto

1. **Instalar el CLI de Nest.js:**
    ```sh
    npm i -g @nestjs/cli
    ```

2. **Instalar dependencias:**
    ```sh
    npm install
    ```

3. **Descargar contenedores Docker:**
    ```sh
    docker pull postgres:15.3
    docker pull dpage/pgadmin4
    ```

4. **Levantar contenedores Docker:**
    ```sh
    docker compose up -d
    ```

5. **Configurar variables de entorno:**
    - Copia el archivo `.env.example` a `.env` y reemplaza las credenciales por las tuyas propias.

6. **Ejecutar migraciones de TypeORM:**
    ```sh
    npm run migration:generate --name=init
    npm run migration:run
    ```
    > Si necesitas revertir una migración:
    > ```sh
    > npm run migration:revert
    > ```

7. **Levantar el servidor:**
    ```sh
    npm run start:dev
    ```

---

## Comandos útiles para migraciones

- **Crear una nueva migración vacía:**
    ```sh
    npm run migration:create --name=nombre-migracion
    ```
- **Generar migración automáticamente según cambios en entidades:**
    ```sh
    npm run migration:generate --name=nombre-migracion
    ```
- **Ejecutar migraciones pendientes:**
    ```sh
    npm run migration:run
    ```
- **Revertir la última migración:**
    ```sh
    npm run migration:revert
    ```

---

## Ejemplos de Curl para probar los endpoints

### Crear una nota
```sh
curl -X POST http://localhost:9090/api/notes \
  -H "Content-Type: application/json" \
  -d '{"text": "Nota de prueba"}'
```

### Obtener todas las notas
```sh
curl http://localhost:9090/api/notes
```

### Obtener una nota por ID
```sh
curl http://localhost:9090/api/notes/<note_id>
```

### Actualizar una nota
```sh
curl -X PATCH http://localhost:9090/api/notes/<note_id> \
  -H "Content-Type: application/json" \
  -d '{"text": "Texto actualizado"}'
```

### Eliminar una nota
```sh
curl -X DELETE http://localhost:9090/api/notes/<note_id>
```

---

> Cambia `<note_id>` por el ID real de la nota que quieras consultar, actualizar o
