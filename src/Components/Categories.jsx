import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { getCategories, deleteCategory } from '../Services/Category';
import { API_URL } from '../Constants/ApiConstant';

function CategoriesComponent() {
  
  const navigate = useNavigate();
  const [listCategories, setListCategories] = useState([]);

  const moveToCategoryAdd = () => {
    navigate('/home/category-add');
  }

  const handleDeleteCategory = (data) => {
    deleteCategory((res) => {
      console.log(res);
      if(res.statusCode === 200) {
        getCategories((res) => {setListCategories(res.data);})
      }
    }, data.id)
  }

  useEffect(() => {
    getCategories((res) => {setListCategories(res.data);})
  }, [])

  const columns = [
    {
      field: 'name',
      headerName: 'Category Name',
      width: 350,
      editable: true,
    },
    {
      field: 'image',
      headerName: 'Image',
      width: 200,
      editable: true,
      renderCell: (params) => (
        <div>
          <img style={{width: '135%', height: '48px'}} src={API_URL+'/'+params.value.file_url} alt="abc" />
        </div>
      )
    },
    {
      field: 'id',
      headerName: 'Handle',
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <div  onClick={() => handleDeleteCategory(params)}>
          <button className='btn btn-danger' >
            Delete
          </button>
        </div>
      )
    },
  ];
  
  return (
    <div className="hotel">
      <div className="hotel-header">
        <h5>Category List</h5>
        <button className="btn btn-success" onClick={moveToCategoryAdd}>Add New</button>
      </div>
      <div>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={listCategories}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
}

export default CategoriesComponent;