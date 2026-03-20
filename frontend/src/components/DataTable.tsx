import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

interface Props<T> {
  rows: T[];
  columns: GridColDef[];
  getRowId: (row: T) => number;
  loading?: boolean;
}

export default function DataTable<T>({ rows, columns, getRowId, loading }: Props<T>) {
  return (
    <Paper sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId as (row: unknown) => number}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
        autoHeight
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
