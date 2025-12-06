import type { Meta, StoryObj } from '@storybook/react-vite';
import { TanTable } from '../src/components/TanTable';
import type { ColumnDef } from '../src/types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Typography, Avatar, Stack, IconButton } from '@mui/material';

// Sample data type
interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Terminated';
  joinDate: Date;
  salary: number;
  performance: number;
  avatar: string;
  isManager: boolean;
}

// Real data
const employees: Employee[] = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    position: "Senior Software Engineer",
    department: "Engineering",
    status: "Active",
    joinDate: new Date("2021-03-15"),
    salary: 145000,
    performance: 92,
    avatar: "https://i.pravatar.cc/150?u=1",
    isManager: false
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus.j@company.com",
    position: "Product Director",
    department: "Product",
    status: "Active",
    joinDate: new Date("2019-11-01"),
    salary: 185000,
    performance: 98,
    avatar: "https://i.pravatar.cc/150?u=2",
    isManager: true
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.w@company.com",
    position: "UX Designer",
    department: "Design",
    status: "On Leave",
    joinDate: new Date("2022-01-10"),
    salary: 95000,
    performance: 88,
    avatar: "https://i.pravatar.cc/150?u=3",
    isManager: false
  },
  {
    id: 4,
    name: "James Rodriguez",
    email: "james.r@company.com",
    position: "DevOps Engineer",
    department: "Engineering",
    status: "Active",
    joinDate: new Date("2020-07-22"),
    salary: 130000,
    performance: 85,
    avatar: "https://i.pravatar.cc/150?u=4",
    isManager: false
  },
  {
    id: 5,
    name: "Lisa Wong",
    email: "lisa.wong@company.com",
    position: "Marketing Manager",
    department: "Marketing",
    status: "Active",
    joinDate: new Date("2021-09-05"),
    salary: 110000,
    performance: 94,
    avatar: "https://i.pravatar.cc/150?u=5",
    isManager: true
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@company.com",
    position: "Data Scientist",
    department: "Data",
    status: "Active",
    joinDate: new Date("2022-04-18"),
    salary: 135000,
    performance: 96,
    avatar: "https://i.pravatar.cc/150?u=6",
    isManager: false
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "robert.t@company.com",
    position: "Sales Representative",
    department: "Sales",
    status: "Inactive",
    joinDate: new Date("2023-01-15"),
    salary: 75000,
    performance: 65,
    avatar: "https://i.pravatar.cc/150?u=7",
    isManager: false
  },
  {
    id: 8,
    name: "Jennifer Garcia",
    email: "j.garcia@company.com",
    position: "HR Specialist",
    department: "HR",
    status: "Active",
    joinDate: new Date("2021-11-30"),
    salary: 85000,
    performance: 90,
    avatar: "https://i.pravatar.cc/150?u=8",
    isManager: false
  },
  {
    id: 9,
    name: "William Thomas",
    email: "will.thomas@company.com",
    position: "Frontend Developer",
    department: "Engineering",
    status: "Terminated",
    joinDate: new Date("2020-02-01"),
    salary: 115000,
    performance: 45,
    avatar: "https://i.pravatar.cc/150?u=9",
    isManager: false
  },
  {
    id: 10,
    name: "Priya Patel",
    email: "priya.p@company.com",
    position: "Finance Director",
    department: "Finance",
    status: "Active",
    joinDate: new Date("2018-06-15"),
    salary: 195000,
    performance: 99,
    avatar: "https://i.pravatar.cc/150?u=10",
    isManager: true
  },
  {
    id: 11,
    name: "Alex Turner",
    email: "alex.t@company.com",
    position: "System Administrator",
    department: "IT",
    status: "Active",
    joinDate: new Date("2019-09-20"),
    salary: 95000,
    performance: 82,
    avatar: "https://i.pravatar.cc/150?u=11",
    isManager: false
  },
  {
    id: 12,
    name: "Maria Santos",
    email: "maria.s@company.com",
    position: "Content Strategist",
    department: "Marketing",
    status: "Active",
    joinDate: new Date("2022-08-10"),
    salary: 88000,
    performance: 91,
    avatar: "https://i.pravatar.cc/150?u=12",
    isManager: false
  },
  {
    id: 13,
    name: "Kevin Miller",
    email: "kevin.m@company.com",
    position: "Account Executive",
    department: "Sales",
    status: "Active",
    joinDate: new Date("2021-05-01"),
    salary: 92000,
    performance: 87,
    avatar: "https://i.pravatar.cc/150?u=13",
    isManager: false
  },
  {
    id: 14,
    name: "Rachel Green",
    email: "rachel.g@company.com",
    position: "Product Manager",
    department: "Product",
    status: "On Leave",
    joinDate: new Date("2020-10-15"),
    salary: 125000,
    performance: 89,
    avatar: "https://i.pravatar.cc/150?u=14",
    isManager: false
  },
  {
    id: 15,
    name: "Samuel Jackson",
    email: "sam.j@company.com",
    position: "Security Analyst",
    department: "IT",
    status: "Active",
    joinDate: new Date("2021-12-05"),
    salary: 110000,
    performance: 93,
    avatar: "https://i.pravatar.cc/150?u=15",
    isManager: false
  }
];

// Column definitions
const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'avatar',
    header: '',
    cellType: 'avatar',
    size: 60,
    cellConfig: {
      imageKey: 'avatar',
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'name',
    header: 'Employee',
    cellType: 'text',
    cellConfig: {
      primary: true,
      secondaryKey: 'position',
    },
    size: 200,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cellType: 'chip',
    cellConfig: {
      colorMap: {
        Engineering: 'primary',
        Product: 'secondary',
        Design: 'info',
        Marketing: 'warning',
        Sales: 'success',
        Finance: 'default',
        HR: 'error',
        Data: 'secondary',
        IT: 'info'
      },
      variant: 'filled',
    },
    filterType: 'select',
    filterConfig: {
      options: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Product', value: 'Product' },
        { label: 'Design', value: 'Design' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Finance', value: 'Finance' },
        { label: 'HR', value: 'HR' },
        { label: 'Data', value: 'Data' },
        { label: 'IT', value: 'IT' },
      ],
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cellType: 'chip',
    cellConfig: {
      colorMap: {
        Active: 'success',
        Inactive: 'default',
        'On Leave': 'warning',
        Terminated: 'error',
      },
      variant: 'outlined',
    },
    filterType: 'multiSelect',
    filterConfig: {
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'On Leave', value: 'On Leave' },
        { label: 'Terminated', value: 'Terminated' },
      ],
    },
  },
  {
    accessorKey: 'email',
    header: 'Contact',
    cellType: 'link',
    cellConfig: {
      href: (row: Employee) => `mailto:${row.email}`,
      target: '_blank',
    },
    size: 200,
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    cellType: 'number',
    cellConfig: {
      format: 'currency',
      currency: 'USD',
      decimals: 0,
    },
    size: 120,
  },
  {
    accessorKey: 'performance',
    header: 'Performance',
    cellType: 'progress',
    cellConfig: {
      type: 'linear',
      showLabel: true,
      color: (value: number) => {
        if (value >= 90) return 'success';
        if (value >= 70) return 'primary';
        if (value >= 50) return 'warning';
        return 'error';
      },
    },
    size: 150,
  },
  {
    accessorKey: 'joinDate',
    header: 'Joined',
    cellType: 'date',
    cellConfig: {
      format: 'medium',
    },
    size: 120,
  },
  {
    accessorKey: 'isManager',
    header: 'Manager',
    cellType: 'boolean',
    cellConfig: {
      display: 'icon',
      showLabel: false,
    },
    size: 80,
  },
  {
    id: 'actions',
    header: 'Actions',
    cellType: 'action',
    cellConfig: {
      actions: [
        {
          label: 'View Profile',
          icon: <VisibilityIcon />,
          onClick: (row) => console.log('View', row),
          color: 'primary',
        },
        {
          label: 'Edit',
          icon: <EditIcon />,
          onClick: (row) => console.log('Edit', row),
          color: 'primary',
        },
        {
          label: 'Delete',
          icon: <DeleteIcon />,
          onClick: (row) => console.log('Delete', row),
          color: 'error',
        },
      ],
      asMenu: true,
    },
    enableSorting: false,
    enableColumnFilter: false,
    size: 80,
  },
];

const meta: Meta<typeof TanTable> = {
  title: 'Components/TanTable',
  component: TanTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TanTable>;

// Basic table with real data subset
export const Basic: Story = {
  args: {
    data: employees.slice(0, 5),
    columns: columns.slice(0, 4) as any, // Show fewer columns for basic
    showToolbar: false,
    showPagination: false,
  },
};

// Full Featured Demo
export const FullFeatured: Story = {
  args: {
    data: employees,
    columns: columns as any,
    enableRowSelection: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enablePagination: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    showToolbar: true,
    toolbarConfig: {
      title: 'Employee Directory',
      subtitle: 'All active and inactive staff members',
      showSearch: true,
      showColumnVisibility: true,
      showExport: true,
      showDensity: true,
      customActions: [
        {
          label: 'Add Employee',
          icon: <AddIcon />,
          onClick: () => alert('Add new employee'),
          color: 'primary',
        }
      ]
    },
  },
};

// Loading State
export const Loading: Story = {
  args: {
    data: [],
    columns: columns as any,
    loading: true,
  },
};

// Empty State
export const Empty: Story = {
  args: {
    data: [],
    columns: columns as any,
    emptyMessage: "No staff members found matching your criteria.",
  },
};

// Inline Editing
export const InlineEditing: Story = {
  args: {
    data: employees,
    columns: columns.filter(c => c.cellType !== 'action') as any,
    enableEditing: true,
    editMode: 'cell',
    onEditingRowSave: (row: any) => {
      console.log('Saved row:', row);
      alert(`Saved changes for ${row.name}`);
    },
  },
};

// Row Editing
export const RowEditing: Story = {
  args: {
    data: employees,
    columns: columns as any,
    enableEditing: true,
    editMode: 'row',
    onEditingRowSave: (row: any) => {
      console.log('Saved row:', row);
      alert(`Saved changes for ${row.name}`);
    },
  },
};

// Cell Selection
export const CellSelection: Story = {
  args: {
    data: employees,
    columns: columns as any,
    enableCellSelection: true,
    enableRowSelection: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
  },
};

// Virtualization
export const Virtualization: Story = {
  args: {
    data: Array.from({ length: 1000 }, (_, i) => ({
      ...employees[i % employees.length],
      id: i,
      name: `${employees[i % employees.length].name} ${i}`,
    })),
    columns: columns as any,
    enableVirtualization: true,
    enablePagination: false,
    sx: { height: 500 },
  },
};

export const ListView: Story = {
  args: {
    ...FullFeatured.args,
    enableListView: true,
    renderListViewItem: (row) => {
      const employee = row.original as Employee;
      return (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={employee.avatar} alt={employee.name} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{employee.name}</Typography>
            <Typography variant="body2" color="text.secondary">{employee.position}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Typography variant="body2" color={employee.status === 'Active' ? 'success.main' : 'text.secondary'}>
               {employee.status}
             </Typography>
             <IconButton size="small">
               <MoreVertIcon />
             </IconButton>
          </Box>
        </Box>
      );
    },
  },
};
