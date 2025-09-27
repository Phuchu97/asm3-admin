import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { deleteCategory, getCategoryHierarchy } from '../Services/Category';

function CategoriesComponent() {
  
  const navigate = useNavigate();
  const [listCategories, setListCategories] = useState([]);

  const moveToCategoryAdd = () => {
    navigate('/home/category-add');
  }

  const handleDeleteCategory = (data) => {
    deleteCategory((res) => {
      if(res.statusCode === 200) {
        loadCategories();
      } else {
        alert(res.message || 'Có lỗi xảy ra khi xóa danh mục');
      }
    }, data.id)
  }

  const loadCategories = () => {
    getCategoryHierarchy((res) => {
      if(res.statusCode === 200) {
        // Use flatCategories from hierarchy response for proper tree structure display
        const flatCategories = res.data.flatCategories || res.data;
        // Lọc bỏ categories cấp 3 trở lên để hiển thị
        const filteredCategories = flatCategories.filter(category => 
          (category.level || 0) <= 2
        );
        setListCategories(filteredCategories);
      }
    });
  }

  // Helper function to render category name with indentation based on level
  const renderCategoryName = (category) => {
    const indent = '— '.repeat(category.level || 0);
    return `${indent}${category.name}`;
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const columns = [
    {
      field: 'name',
      headerName: 'Category Name',
      width: 300,
      editable: false,
      renderCell: (params) => (
        <div style={{ fontFamily: 'monospace' }}>
          {renderCategoryName(params.row)}
        </div>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <div>
          {params.value ? 'Active' : 'Inactive'}
        </div>
      )
    },
    {
      field: 'order',
      headerName: 'Sort Order',
      width: 120,
      editable: false,
    },
    {
      field: 'slug',
      headerName: 'Slug',
      width: 200,
      editable: false,
    },
    {
      field: 'id',
      headerName: 'Actions',
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <div>
          <button 
            className='btn btn-primary mr-2'
            onClick={() => navigate(`/home/category-edit/${params.row._id}`)}
            style={{marginRight: '8px'}}
          >
            Edit
          </button>
          <button 
            className='btn btn-danger' 
            onClick={() => handleDeleteCategory(params)}
          >
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
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={listCategories}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row._id}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Box>
      </div>
    </div>
  );
}

export default CategoriesComponent;