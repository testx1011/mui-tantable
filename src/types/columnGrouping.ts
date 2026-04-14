import type { ReactNode } from 'react';

export interface ColumnGroup {
  groupId: string;
  headerName?: string;
  description?: string;
  headerAlign?: 'left' | 'center' | 'right';
  children: ColumnGroupNode[];
  renderHeaderGroup?: (params: ColumnGroupHeaderParams) => ReactNode;
  headerClassName?: string;
}

export interface ColumnGroupHeaderParams {
  groupId: string | null;
  headerName?: string;
  description?: string;
}

export type ColumnGroupNode = ColumnGroup | string;

export type ColumnGroupingModel = ColumnGroup[];

export interface ColumnGroupingState {
  lookup: Record<string, Omit<ColumnGroup, 'children'>>;
  headerStructure: ColumnGroupHeaderRow[];
  maxDepth: number;
}

export interface ColumnGroupHeaderRow {
  groups: ColumnGroupHeaderCell[];
}

export interface ColumnGroupHeaderCell {
  groupId: string | null;
  headerName?: string;
  colSpan: number;
  rowSpan: number;
  isLeaf: boolean;
  columnId?: string;
  headerAlign?: 'left' | 'center' | 'right';
}
