import { TableRow, TableCell } from '@mui/material';
import { Table } from '@tanstack/react-table';
import { TextFilter, NumberFilter, DateFilter, SelectFilter, MultiSelectFilter } from './index';
import type { FilterConfig } from '../types';

interface FilterRowProps<TData> {
    table: Table<TData>;
}

export function FilterRow<TData>({ table }: FilterRowProps<TData>) {
    return (
        <TableRow>
            {/* Spacer for expanding column */}
            {table.options.enableExpanding && <TableCell />}

            {/* Spacer for row selection column */}
            {table.options.enableRowSelection && <TableCell />}

            {table.getVisibleLeafColumns().map((column) => {
                const filterType = (column.columnDef as any).filterType;
                const filterConfig = (column.columnDef as any).filterConfig as FilterConfig;

                // Skip filter if not enabled or no accessor
                if (!column.getCanFilter()) {
                    return <TableCell key={column.id} />;
                }

                const commonProps = {
                    column,
                    table,
                };

                const renderFilter = () => {
                    switch (filterType) {
                        case 'text':
                            return <TextFilter {...commonProps} config={filterConfig as any} />;
                        case 'number':
                            return <NumberFilter {...commonProps} config={filterConfig as any} />;
                        case 'date':
                            return <DateFilter {...commonProps} config={filterConfig as any} />;
                        case 'select':
                            return <SelectFilter {...commonProps} config={filterConfig as any} />;
                        case 'multiSelect':
                            return <MultiSelectFilter {...commonProps} config={filterConfig as any} />;
                        default:
                            return <TextFilter {...commonProps} config={filterConfig as any} />;
                    }
                };

                return (
                    <TableCell key={column.id} sx={{ p: 1 }}>
                        {renderFilter()}
                    </TableCell>
                );
            })}
        </TableRow>
    );
}
