import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { getCategories, deleteCategory, getCategoryHierarchy } from '../Services/Category';
import { API_URL } from '../Constants/ApiConstant';

function CategoriesComponent() {
  
  const navigate = useNavigate();
  const [listCategories, setListCategories] = useState([]);
  const [categoryHierarchy, setCategoryHierarchy] = useState({});

  const moveToCategoryAdd = () => {
    navigate('/home/category-add');
  }

  const handleDeleteCategory = (data) => {
    deleteCategory((res) => {
      console.log(res);
      if(res.statusCode === 200) {
        loadCategories();
      }
    }, data.id)
  }

  const loadCategories = () => {
    getCategories((res) => {
      if(res.statusCode === 200) {
        // Bổ sung thông tin về danh mục cha
        const categories = res.data;
        const categoriesMap = {};
        
        // Tạo map để tra cứu nhanh
        categories.forEach(category => {
          categoriesMap[category._id] = category;
        });
        
        // Thêm thông tin về tên danh mục cha
        const categoriesWithParentName = categories.map(category => {
          if (category.parent_id && categoriesMap[category.parent_id]) {
            return {
              ...category,
              parent_name: categoriesMap[category.parent_id].name
            };
          }
          return {
            ...category,
            parent_name: '-'
          };
        });
        
        setListCategories(categoriesWithParentName);
      }
    });
    
    // Lấy cấu trúc cây danh mục
    getCategoryHierarchy((res) => {
      if(res.statusCode === 200) {
        setCategoryHierarchy(res.data);
      }
    });
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const columns = [
    {
      field: 'name',
      headerName: 'Category Name',
      width: 250,
      editable: true,
    },
    {
      field: 'parent_name',
      headerName: 'Parent Category',
      width: 200,
      editable: false,
    },
    {
      field: 'image',
      headerName: 'Image',
      width: 150,
      editable: true,
      renderCell: (params) => (
        <div>
          <img style={{width: '135%', height: '48px'}} src={params.value} alt="abc" />
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