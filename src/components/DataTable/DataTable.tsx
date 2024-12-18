import React, { useEffect, useMemo } from 'react';

import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table';

import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  lighten,
} from '@mui/material';

//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';

type IdentifiableElement<TId> = { id: TId, data: object };

type Props<TId> = {
  onSelectElements?: (ids: TId[]) => void;
  selectedIds?: TId[];
  data: IdentifiableElement<TId>[];
};


function getAvailableColumns<T>(elems: IdentifiableElement<T>[]) {
  const columns = elems
    .map(e => Object.keys(e.data))

    // count each key occurrence
    .reduce((st, keys) => {
      keys.forEach(k => st[k] = true)
      return st;
    }, {} as Record<string, boolean>);

  return Object.keys(columns);
}

function getSuggestedColumns<T>(elems: IdentifiableElement<T>[], count = 5) {
  const columnsCount = elems
    .map(e => Object.keys(e.data))

    // count each key occurrence
    .reduce((st, keys) => {
      keys.forEach(k => st[k] == null
        ? st[k] = 1
        : st[k]++)
      return st;
    }, {} as Record<string, number>);

  const topColumns = Object.entries(columnsCount)
    // sort descending by count
    .sort((a, b) => b[1] - a[1])

    // get top N
    .slice(0, count - 1)
    .map(e => e[0]);

  return topColumns;
}

export function DataTable(props: Props<string>) {
  const columns = useMemo(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: "Id",
        filterVariant: 'autocomplete',
      } as const,

      ...getAvailableColumns(props.data)
        .map(key => ({
          id: key,
          accessorKey: `data.${key}`,
          header: key,
          //footer: key,
          filterVariant: 'autocomplete',
        }) as const),
    ],
    [props.data]
  );

  const rowSelectionState = useMemo(
    () => Object.fromEntries(
      props.selectedIds
        ?.map(id => [id, true])
      ?? []),
    [props.selectedIds]
  );

  const table = useMaterialReactTable({
    columns,
    data: props.data,
    enableFullScreenToggle: true,
    enableColumnFilterModes: true,
    enableHiding: true, // enable hidding columns
    //enableColumnOrdering: true,
    //enableGrouping: true,
    enableColumnPinning: true,
    //enableFacetedValues: true,
    enableRowActions: false,
    enableRowSelection: true,
    enablePagination: false,

    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
      density: 'compact',
    },

    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },

    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [10, 20, 30],
      shape: 'rounded',
      variant: 'outlined',
    },

    enableTableFooter: false,
    enableStickyHeader: true,
    enableStickyFooter: false,
    enableBottomToolbar: false,
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100% - 56px)',
      },
    },

    muiTablePaperProps: {
      sx: {
        height: '100%',
      },
    },


    getRowId: (e) => e.id,

    onRowSelectionChange: (updaterOrValue) => {
      const selectedState = (typeof (updaterOrValue) == 'function')
        ? updaterOrValue(rowSelectionState)
        : updaterOrValue;

      const ids = Object.entries(selectedState)
        // filter selected === true
        .filter(([_k, v]) => v)
        .map(([k, _v]) => k);

      props.onSelectElements?.(ids);
    },

    state: {
      rowSelection: rowSelectionState,
    },

    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-around',
          left: '30px',
          maxWidth: '1000px',
          position: 'sticky',
          width: '100%',
        }}
      >
        <h3>Details</h3>
        <pre>{JSON.stringify(props.data.find(e => e.id === row.id))}</pre>
      </Box>
    ),

    renderRowActionMenuItems: ({ closeMenu }) => [
      <MenuItem
        key={0}
        onClick={() => {
          // View profile logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        View Profile
      </MenuItem>,
      <MenuItem
        key={1}
        onClick={() => {
          // Send email logic...
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Send />
        </ListItemIcon>
        Send Email
      </MenuItem>,
    ],

    // renderTopToolbar: ({ table }) => {
    //   const handleDeactivate = () => {
    //     table.getSelectedRowModel().flatRows.map((row) => {
    //       alert('deactivating ' + row.getValue('name'));
    //     });
    //   };
    //
    //   const handleActivate = () => {
    //     table.getSelectedRowModel().flatRows.map((row) => {
    //       alert('activating ' + row.getValue('name'));
    //     });
    //   };
    //
    //   const handleContact = () => {
    //     table.getSelectedRowModel().flatRows.map((row) => {
    //       alert('contact ' + row.getValue('name'));
    //     });
    //   };
    //
    //   return (
    //     <Box
    //       sx={(theme) => ({
    //         backgroundColor: lighten(theme.palette.background.default, 0.05),
    //         display: 'flex',
    //         gap: '0.5rem',
    //         p: '8px',
    //         justifyContent: 'space-between',
    //       })}
    //     >
    //       <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
    //         {/* import MRT sub-components */}
    //         <MRT_GlobalFilterTextField table={table} />
    //         <MRT_ToggleFiltersButton table={table} />
    //       </Box>
    //       <Box>
    //         <Box sx={{ display: 'flex', gap: '0.5rem' }}>
    //           <Button
    //             color="error"
    //             disabled={!table.getIsSomeRowsSelected()}
    //             onClick={handleDeactivate}
    //             variant="contained"
    //           >
    //             Deactivate
    //           </Button>
    //           <Button
    //             color="success"
    //             disabled={!table.getIsSomeRowsSelected()}
    //             onClick={handleActivate}
    //             variant="contained"
    //           >
    //             Activate
    //           </Button>
    //           <Button
    //             color="info"
    //             disabled={!table.getIsSomeRowsSelected()}
    //             onClick={handleContact}
    //             variant="contained"
    //           >
    //             Contact
    //           </Button>
    //         </Box>
    //       </Box>
    //     </Box>
    //   );
    //},
  });

  useEffect(() => {
    // auto-set column visibility when data changes
    const suggestedColumns = getSuggestedColumns(props.data);
    table.setColumnVisibility(
      Object.fromEntries(suggestedColumns.map(k => [k, true])));
  }, [table, props.data]);

  console.log("<Table />", { props, columns });

  return <MaterialReactTable table={table} />;
};

