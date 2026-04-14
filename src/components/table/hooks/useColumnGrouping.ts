import type {
  ColumnGroup,
  ColumnGroupNode,
  ColumnGroupingState,
  ColumnGroupHeaderCell,
} from '../../../types/columnGrouping';

export interface ParseColumnGroupingOptions {
  model: ColumnGroup[];
  columnIds: string[];
}

export function parseColumnGrouping({
  model,
  columnIds,
}: ParseColumnGroupingOptions): ColumnGroupingState {
  const lookup: Record<string, Omit<ColumnGroup, 'children'>> = {};
  const maxDepth = getMaxDepth(model);

  function buildLookup(groups: ColumnGroup[], parentPath: string[] = []) {
    for (const group of groups) {
      lookup[group.groupId] = {
        groupId: group.groupId,
        headerName: group.headerName,
        description: group.description,
        headerAlign: group.headerAlign,
        renderHeaderGroup: group.renderHeaderGroup,
        headerClassName: group.headerClassName,
      };

      if (group.children) {
        buildLookup(
          group.children.filter((c: ColumnGroupNode): c is ColumnGroup => typeof c === 'object'),
          [...parentPath, group.groupId],
        );
      }
    }
  }

  buildLookup(model);

  return {
    lookup,
    headerStructure: buildHeaderStructure(model, columnIds),
    maxDepth,
  };
}

function getMaxDepth(groups: ColumnGroup[]): number {
  let max = 0;
  for (const group of groups) {
    const childDepth = getChildDepth(group.children);
    max = Math.max(max, childDepth + 1);
  }
  return max;
}

function getChildDepth(children: ColumnGroupNode[]): number {
  let max = 0;
  for (const child of children) {
    if (typeof child === 'object') {
      const childDepth = getChildDepth(child.children);
      max = Math.max(max, childDepth + 1);
    }
  }
  return max;
}

function buildHeaderStructure(
  groups: ColumnGroup[],
  columnIds: string[],
): { groups: ColumnGroupHeaderCell[] }[] {
  if (groups.length === 0) return [];

  const maxDepth = getMaxDepth(groups);
  const structure: { groups: ColumnGroupHeaderCell[] }[] = [];

  const usedColumnIds = new Set<string>();

  for (let depth = 0; depth < maxDepth; depth++) {
    const row: ColumnGroupHeaderCell[] = [];
    processGroupsAtLevel(groups, depth, columnIds, row, usedColumnIds);
    structure.push({ groups: row });
  }

  for (const colId of columnIds) {
    if (!usedColumnIds.has(colId)) {
      structure[structure.length - 1].groups.push({
        groupId: null,
        colSpan: 1,
        rowSpan: 1,
        isLeaf: true,
        columnId: colId,
      });
    }
  }

  return structure;
}

function processGroupsAtLevel(
  groups: ColumnGroup[],
  targetDepth: number,
  columnIds: string[],
  row: ColumnGroupHeaderCell[],
  usedColumnIds: Set<string>,
  currentDepth = 0,
) {
  for (const group of groups) {
    if (currentDepth === targetDepth) {
      const childColumnIds = getChildColumnIds(group.children, columnIds);
      if (childColumnIds.length > 0) {
        row.push({
          groupId: group.groupId,
          headerName: group.headerName,
          colSpan: childColumnIds.length,
          rowSpan: 1,
          isLeaf: false,
        });
        childColumnIds.forEach((id) => usedColumnIds.add(id));
      }
    } else {
      processGroupsAtLevel(
        group.children.filter((c): c is ColumnGroup => typeof c === 'object'),
        targetDepth,
        columnIds,
        row,
        usedColumnIds,
        currentDepth + 1,
      );
    }
  }
}

function getChildColumnIds(children: ColumnGroupNode[], columnIds: string[]): string[] {
  const result: string[] = [];
  for (const child of children) {
    if (typeof child === 'string') {
      if (columnIds.includes(child)) {
        result.push(child);
      }
    } else {
      result.push(...getChildColumnIds(child.children, columnIds));
    }
  }
  return result;
}
