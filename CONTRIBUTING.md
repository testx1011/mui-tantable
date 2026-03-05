# Contribuyendo a mui-tantable

¡Gracias por tu interés en mejorar el proyecto! Para mantener nuestro código claro y colaborar de forma eficiente, sigue estos pasos:

## Requisitos previos

1. Node.js 18+ instalado.
2. Clonar el repositorio y ejecutar `npm install`.
3. Familiarizarte con TypeScript y React.

```bash
git clone https://github.com/testx1011/mui-tantable.git
cd mui-tantable
npm install
```

## Formato y calidad

- Ejecuta `npm run lint` antes de mandar un PR y corrige los errores.
- Usa `npm run build` para asegurarte de que la librería compila.
- Añade/actualiza tipos en `src/` si introduces nueva funcionalidad.
- Mantén las dependencias bajo control y agrega entradas a `package.json` sólo si son estrictamente necesarias.

## Workflow de Git

1. Crea una rama descriptiva a partir de `main`:
   ```bash
git checkout -b feature/nombre-corto
```
2. Haz commits pequeños y con mensajes claros.
3. Rebase o merge desde `main` regularmente para evitar conflictos.

## Pull Requests

- Abre un issue antes de trabajar en cambios grandes.
- Incluye en la descripción del PR:
  - Objetivo del cambio.
  - Cómo probarlo (link a Storybook, ejemplos, etc.).
  - Si modifica la API, explica los efectos y añade documentación.
- Añade pruebas cuando sea posible (Vitest, Playwright).
- Etiqueta al menos un revisor o deja un comentario solicitando revisión.

## Reporte de errores y solicitudes de características

Usa las [plantillas de issue](.github/ISSUE_TEMPLATE/) para facilitar la información.

## Código de conducta

Este proyecto adopta el [Código de Conducta de los Colaboradores](CODE_OF_CONDUCT.md). Al participar, acepta cumplir con sus normas y puede ser removido del proyecto si infringe las reglas.

---

Gracias de nuevo por contribuir. ¡Tus mejoras hacen la librería más útil para todos!  

[salto]: # (Este archivo se incluye en README.md para proporcionar más detalles.)