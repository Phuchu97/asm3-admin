import * as React from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    {
      field: 'name',
      headerName: 'Customer',
      width: 200,
      editable: true,
    },
    {
      field: 'hotel',
      headerName: 'Hotel',
      width: 250,
      editable: true,
    },
    {
      field: 'rooms',
      headerName: 'Room',
      width: 110,
      editable: true,
    },
    {
      field: 'startDate',
      headerName: 'Start date',
      width: 150,
      editable: true,
    },
    {
      field: 'endDate',
      headerName: 'End date',
      width: 150,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      width: 150,
      editable: true,
    },
    {
      field: 'payment',
      headerName: 'Payment Method',
      width: 150,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      editable: true,
      renderCell: (params) => (
        <div>
          <button className='btn btn-success' disabled>
            {params.value}
          </button>
        </div>
      )
    }
];

 function DataGridDemo(props) {
  
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        getRowId={(row) => row._id}
        rows={props.rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}

export default DataGridDemo;