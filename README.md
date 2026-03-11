# 🚀 Mui TanTable

[![GitHub stars](https://img.shields.io/github/stars/testx1011/mui-tantable?style=flat-square&logo=github)](https://github.com/testx1011/mui-tantable/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/testx1011/mui-tantable?style=flat-square&logo=github)](https://github.com/testx1011/mui-tantable/network/members)
[![GitHub issues](https://img.shields.io/github/issues/testx1011/mui-tantable?style=flat-square&logo=github)](https://github.com/testx1011/mui-tantable/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/testx1011/mui-tantable?style=flat-square&logo=github)](https://github.com/testx1011/mui-tantable/pulls)
[![License](https://img.shields.io/github/license/testx1011/mui-tantable?style=flat-square)](https://github.com/testx1011/mui-tantable/blob/main/LICENSE)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-Contributor%20Covenant-blue?style=flat-square)](CODE_OF_CONDUCT.md)
[![Build (GitHub Actions)](https://img.shields.io/github/actions/workflow/status/testx1011/mui-tantable/ci.yml?style=flat-square)](https://github.com/testx1011/mui-tantable/actions)
[![npm (latest)](https://img.shields.io/npm/v/mui-tantable?style=flat-square)](https://www.npmjs.com/package/mui-tantable)
[![npm downloads](https://img.shields.io/npm/dw/mui-tantable?style=flat-square)](https://www.npmjs.com/package/mui-tantable)
[![Socket Badge](https://badge.socket.dev/npm/package/mui-tantable/0.1.4)](https://badge.socket.dev/npm/package/mui-tantable/0.1.4)

Un componente de tabla basado en TanStack Table y Material‑UI (MUI) pensado para listas y tablas ricas en funcionalidades, rendimiento y accesibilidad. ✨

**Estado**: 🛠️ desarrollo — funcionalidad principal implementada (virtualización, selección de celdas, atajos de teclado, vista lista, búsqueda expandible).

**Repositorio:** 🔗 https://github.com/testx1011/mui-tantable

**📚 Documentación**
- [CONTRIBUTING](CONTRIBUTING.md)  
- [CODE OF CONDUCT](CODE_OF_CONDUCT.md)  
- [SECURITY](SECURITY.md)  
- [CHANGELOG](CHANGELOG.md)


**Instalación rápida (clonar desde GitHub)**
```bash
git clone https://github.com/testx1011/mui-tantable.git
cd mui-tantable
npm install
```

**Instalación desde npm**
```bash
npm install mui-tantable
# o con yarn
yarn add mui-tantable
```

**🎯 Objetivo**
- Proveer una tabla altamente personalizable y eficiente para aplicaciones React con estilo MUI.
- Ofrecer características tipo Data Grid (filtrado, ordenación, paginación, selección, virtualización y vista lista).

**✨ Características principales**
- ⚙️ **Renderizado flexible**: columnas definidas con `ColumnDef` y renderers personalizados.
- ⚡️ **Virtualización**: soporta `@tanstack/react-virtual` para miles de filas.
- 📋 **Vista Lista**: `enableListView` + `renderListViewItem` para presentar datos en un solo columna estilo list view (inspirado en MUI X List View).
- 🔘 **Selección de celdas y filas**: selección visual de celdas y selección multi-fila.
- ⌨️ **Atajos del teclado**: `Ctrl+C` copia el contenido de la celda/filas en formato tabular compatible con Excel/Sheets.
- 🔎 **Búsqueda expandible**: UI de búsqueda con animación al estilo MUI Data Grid quick filter.
- ✍️ **Edición in-cell / in-row**: soporte para modos de edición por celda o por fila (configurable).
- 🧭 **Toolbar**: búsqueda, visibilidad de columnas, exportación (CSV/Excel/JSON), opciones de densidad y conmutador de vista (grid/list).

**📁 Estructura del proyecto (resumen)**
- `src/components/TanTable.tsx` — componente principal.
- `src/components/TableToolbar.tsx` — barra de herramientas (search, export, density, view switcher).
- `src/components/ExpandableSearch.tsx` — búsqueda expandible.
- `src/components/cells/*` — renderers de celdas (texto, número, fecha, avatar...).
- `src/components/filters/*` — filtros integrados.
- `src/utils/*` — exportadores, formateadores y utilidades.
- `stories/TanTable.stories.tsx` — historias de Storybook con ejemplos (incluye `ListView`, `Virtualization`).

**Requisitos**
- Node.js 18+ (recomendado).
- Dependencias gestionadas en `package.json`.

**🧰 Instalación (desarrollo local)**
```bash
# clona el repo
git clone https://github.com/testx1011/mui-tantable.git
cd mui-tantable

# instala dependencias
npm install

# levantar storybook (si está configurado)
npm run storybook

# o construir el paquete
npm run build
```

**⚡ Uso básico**
Ejemplo mínimo con `TanTable`:

```tsx
import React from 'react';
import { TanTable } from 'mui-tantable';

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name', cellType: 'text' },
  { accessorKey: 'email', header: 'Email', cellType: 'link' },
];

const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

export default function App() {
  return (
    <TanTable
      data={data}
      columns={columns}
      enableVirtualization={true}
      enableRowSelection={true}
      toolbarConfig={{ title: 'Mi Tabla' }}
    />
  );
}
```

**Activar vista Lista**
```tsx
<TanTable
  data={data}
  columns={columns}
  enableListView={true}
  renderListViewItem={(row) => (
    <div style={{ padding: 12, display: 'flex', alignItems: 'center' }}>
      <img src={row.original.avatar} alt="avatar" style={{ width: 40, height: 40, borderRadius: 20 }} />
      <div style={{ marginLeft: 12 }}>
        <div>{row.original.name}</div>
        <div style={{ color: '#666' }}>{row.original.email}</div>
      </div>
    </div>
  )}
/>
```

**🛠️ Comandos útiles**
- `npm run build` — compila la librería (usa `tsup`).
- `npm run dev` — (si está definido) desarrolla localmente.
- `npm run storybook` — abre Storybook con ejemplos interactivos.

**Desarrollo y pruebas**
- Mantén `typescript` y `eslint` limpios (si están configurados).
- Ejecuta `npm run build` después de cambios de tipos o exports.

**🙌 Guía rápida de contribuciones**
Consulta el [CONTRIBUTING](CONTRIBUTING.md) para detalles completos: desde cómo clonar el repo hasta el flujo de PR y estándares de código.

- Abre un issue para discutir cambios grandes.
- Crea PRs pequeños y enfocados; incluye el objetivo y demos en Storybook cuando sea posible.

**🔮 Siguientes pasos sugeridos**
- Añadir badges (build, coverage, npm) al `README.md`.
- Documentar la API de `ColumnDef` y los `cellType` en detalle.
- Añadir ejemplos de integración (Next.js, CRA, Vite).

## ☕ Apoyo

Si encuentras útil este proyecto, ¡puedes invitarme un café!

[![Buy me a coffee](https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=testx1011&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/testx1011)
