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

A table component based on TanStack Table and Material‑UI (MUI) designed for feature-rich, high-performance, and accessible lists and tables. ✨

**Status**: 🛠️ development — core functionality implemented (virtualization, cell selection, keyboard shortcuts, list view, expandable search).

**Repository:** 🔗 https://github.com/testx1011/mui-tantable

**📚 Documentation**

- [CONTRIBUTING](CONTRIBUTING.md)
- [CODE OF CONDUCT](CODE_OF_CONDUCT.md)
- [SECURITY](SECURITY.md)
- [CHANGELOG](CHANGELOG.md)

**Quick Install (clone from GitHub)**

```bash
git clone https://github.com/testx1011/mui-tantable.git
cd mui-tantable
npm install
# or use pnpm if you prefer
# pnpm install
```

**Install from npm**

```bash
npm install mui-tantable
# or with yarn
yarn add mui-tantable
```

### Peer Dependencies

mui-tantable requires the following peer dependencies. Install them along with the package:

```bash
npm install @mui/material @emotion/react @emotion/styled
# or
pnpm add @mui/material @emotion/react @emotion/styled
# or
yarn add @mui/material @emotion/react @emotion/styled
```

> **Note:** `react` and `react-dom` are also peer dependencies but are usually already installed in your project.

**🎯 Goal**

- Provide a highly customizable and efficient table for React applications with MUI styling.
- Offer Data Grid features (filtering, sorting, pagination, selection, virtualization, and list view).

**✨ Key Features**

- ⚙️ **Flexible Rendering**: Columns defined with `ColumnDef` and custom renderers.
- ⚡️ **Virtualization**: Supports `@tanstack/react-virtual` for thousands of rows.
- 📋 **List View**: `enableListView` + `renderListViewItem` to present data in a single-column list view style (inspired by MUI X List View).
- 🔘 **Cell & Row Selection**: Visual cell selection and multi-row selection.
- ⌨️ **Keyboard Shortcuts**: `Ctrl+C` copies cell/row content in tabular format compatible with Excel/Sheets.
- 🔎 **Expandable Search**: Search UI with animation MUI Data Grid quick filter style.
- ✍️ **In-cell / In-row Editing**: Support for cell-by-cell or row-by-row editing modes (configurable).
- 🧭 **Toolbar**: Search, column visibility, export (CSV/Excel/JSON), density options, and view switcher (grid/list).

**📁 Project Structure (summary)**

- `src/components/TanTable.tsx` — main component.
- `src/components/TableToolbar.tsx` — toolbar (search, export, density, view switcher).
- `src/components/ExpandableSearch.tsx` — expandable search.
- `src/components/cells/*` — cell renderers (text, number, date, avatar...).
- `src/components/filters/*` — built-in filters.
- `src/utils/*` — exporters, formatters, and utilities.
- `stories/TanTable.stories.tsx` — Storybook stories with examples (includes `ListView`, `Virtualization`).

**Requirements**

- Node.js 18+ (recommended).
- Dependencies managed in `package.json`.

**🧰 Installation (local development)**

```bash
# clone the repo
git clone https://github.com/testx1011/mui-tantable.git
cd mui-tantable

# install dependencies
npm install

# start storybook (if configured)
npm run storybook

# or build the package
npm run build
```

**⚡ Basic Usage**
Minimal example with `TanTable`:

```tsx
import React from "react";
import { TanTable } from "mui-tantable";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name", cellType: "text" },
  { accessorKey: "email", header: "Email", cellType: "link" },
];

const data = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

export default function App() {
  return (
    <TanTable
      data={data}
      columns={columns}
      enableVirtualization={true}
      enableRowSelection={true}
      toolbarConfig={{ title: "My Table" }}
    />
  );
}
```

**Enable List View**

```tsx
<TanTable
  data={data}
  columns={columns}
  enableListView={true}
  renderListViewItem={(row) => (
    <div style={{ padding: 12, display: "flex", alignItems: "center" }}>
      <img
        src={row.original.avatar}
        alt="avatar"
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <div style={{ marginLeft: 12 }}>
        <div>{row.original.name}</div>
        <div style={{ color: "#666" }}>{row.original.email}</div>
      </div>
    </div>
  )}
/>
```

**🛠️ Useful Commands**

- `npm run build` — compiles the library (uses `tsup`).
- `npm run dev` — (if defined) local development.
- `npm run storybook` — opens Storybook with interactive examples.

**Development and Testing**

- Keep `typescript` and `eslint` clean (if configured).
- Run `npm run build` after type or export changes.

**🙌 Quick Contribution Guide**
See [CONTRIBUTING](CONTRIBUTING.md) for complete details: from cloning the repo to PR workflow and code standards.

- Open an issue to discuss large changes.
- Create small, focused PRs; include the objective and Storybook demos when possible.

**🔮 Suggested Next Steps**

- Add badges (build, coverage, npm) to `README.md`.
- Document `ColumnDef` API and `cellType` in detail.
- Add integration examples (Next.js, CRA, Vite).

## ☕ Support

If you find this project useful, you can buy me a coffee!

[![Buy me a coffee](https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=testx1011&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/testx1011)
