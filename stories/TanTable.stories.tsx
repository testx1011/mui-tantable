import type { Meta, StoryObj } from '@storybook/react-vite';
import { TanTable } from '../src/components/TanTable';
import type { TanTableColumnDef } from '../src/types/columns';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: boolean;
}

const columns: TanTableColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 60,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cellType: 'text',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cellType: 'email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cellType: 'text',
  },
  {
    accessorKey: 'status',
    header: 'Active',
    cellType: 'boolean',
  },
];

const sampleData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: true },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: true },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: false },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: true },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: true },
  { id: 6, name: 'David Lee', email: 'david@example.com', role: 'Admin', status: false },
  { id: 7, name: 'Eva Martinez', email: 'eva@example.com', role: 'User', status: true },
  { id: 8, name: 'Frank Garcia', email: 'frank@example.com', role: 'Manager', status: true },
];

const meta: Meta<typeof TanTable<User>> = {
  title: 'Components/TanTable',
  component: TanTable,
  parameters: {
    layout: 'padded',
    a11y: {
      disable: true,
    },
    docs: {
      story: {
        inline: false,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    enableSorting: { control: 'boolean' },
    enableColumnFilters: { control: 'boolean' },
    enablePagination: { control: 'boolean' },
    enableRowSelection: { control: 'boolean' },
    enableVirtualization: { control: 'boolean' },
    density: {
      control: 'select',
      options: ['compact', 'standard', 'comfortable'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof TanTable<User>> = {
  args: {
    data: sampleData,
    columns,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    density: 'standard',
  },
};

export const WithRowSelection: StoryObj<typeof TanTable<User>> = {
  args: {
    data: sampleData,
    columns,
    enableRowSelection: true,
    enableSorting: true,
    enablePagination: true,
  },
};

export const WithVirtualization: StoryObj<typeof TanTable<User>> = {
  args: {
    data: [
      ...sampleData,
      ...Array.from({ length: 100 }, (_, i) => ({
        id: i + 9,
        name: `User ${i + 9}`,
        email: `user${i + 9}@example.com`,
        role: 'User',
        status: i % 2 === 0,
      })),
    ],
    columns,
    enableVirtualization: true,
    height: 400,
  },
};

export const Compact: StoryObj<typeof TanTable<User>> = {
  args: {
    data: sampleData,
    columns,
    density: 'compact',
    enablePagination: true,
  },
};

export const Loading: StoryObj<typeof TanTable<User>> = {
  args: {
    data: sampleData,
    columns,
    loading: true,
    enablePagination: true,
  },
};

export const Empty: StoryObj<typeof TanTable<User>> = {
  args: {
    data: [],
    columns,
    emptyMessage: 'No users found',
  },
};

export const WithColumnGrouping: StoryObj<typeof TanTable<User>> = {
  args: {
    data: sampleData,
    columns,
    columnGroupingModel: [
      {
        groupId: 'personal',
        headerName: 'Personal Information',
        children: ['name', 'email'],
      },
      {
        groupId: 'work',
        headerName: 'Work Info',
        children: ['role'],
      },
    ],
    enableSorting: true,
  },
};

export const WithRowReorder: StoryObj<typeof TanTable<User>> = {
  args: {
    data: sampleData,
    columns,
    rowReordering: true,
    onRowOrderChange: (newOrder: User[]) => {
      console.log('New order:', newOrder);
    },
  },
};

export const WithFooter: StoryObj<typeof TanTable<User>> = {
  args: {
    data: sampleData,
    columns,
    enableFooter: true,
    footerConfig: {
      showCount: true,
      numericOnly: true,
    },
    enablePagination: true,
  },
};

export const ServerSide: StoryObj<typeof TanTable<User>> = {
  args: {
    data: sampleData,
    columns,
    serverSide: true,
    serverSideHandlers: {
      totalRowCount: 100,
      onFetchData: async () => ({ data: sampleData, totalRowCount: 100 }),
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  },
};
