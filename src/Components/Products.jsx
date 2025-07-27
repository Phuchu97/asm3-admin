import { Box, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../Constants/ApiConstant';
import { getListProducts, deleteProduct, updateProductStatus, updateProductFeatured } from '../Services/Products';
import { getCategoryHierarchy } from '../Services/Category';
import CheckModalComponent from '../Modals/CheckModal';

function ProductsComponent() {
  
  const navigate = useNavigate();
  const [listProducts, setListProducts] = useState([]);
  const [currentIdProduct, setCurrentIdProduct] = useState('');
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal check accept
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (id) => {
    setOpenModal(true);
    setCurrentIdProduct(id);
  };

  const handleCloseModal = () => {
    setOpenModal(false)
  };

  const moveToProductAdd = () => {
    navigate('/home/product-add/new');
  }

  const moveToEditAdd = (id) => {
    navigate(`/home/product-add/${id}`);
  }

  const handleDeleteProduct = () => {
    deleteProduct((res) => {
      if(res.statusCode === 200) {
        getListProducts(handleGetProducts);
      } else {
        alert('Có lỗi trong quá trình xử lý!')
      }
    }, {id: currentIdProduct});
    handleCloseModal();
  }

  const handleGetProducts = (res) => {
    if (res.statusCode === 200) {
      // Làm phong phú dữ liệu sản phẩm với thông tin danh mục
      const productsWithCategoryInfo = res.data.map(product => {
        const category = categoryMap[product.category_id];
        return {
          ...product,
          category_name: category ? category.name : 'Không xác định',
          category_path: category ? category.path : '',
        };
      });
      setListProducts(productsWithCategoryInfo);
    }
    setLoading(false);
  }
  
  // Hàm cập nhật trạng thái sản phẩm
  const handleToggleStatus = (id, currentStatus) => {
    updateProductStatus((res) => {
      if (res.statusCode === 200) {
        // Cập nhật lại danh sách sản phẩm
        const updatedProducts = listProducts.map(product => {
          if (product._id === id) {
            return { ...product, status: !currentStatus };
          }
          return product;
        });
        setListProducts(updatedProducts);
      } else {
        alert('Cập nhật trạng thái thất bại!');
      }
    }, { id, status: !currentStatus });
  };
  
  // Hàm cập nhật trạng thái nổi bật của sản phẩm
  const handleToggleFeatured = (id, currentFeatured) => {
    updateProductFeatured((res) => {
      if (res.statusCode === 200) {
        // Cập nhật lại danh sách sản phẩm
        const updatedProducts = listProducts.map(product => {
          if (product._id === id) {
            return { ...product, featured: !currentFeatured };
          }
          return product;
        });
        setListProducts(updatedProducts);
      } else {
        alert('Cập nhật trạng thái nổi bật thất bại!');
      }
    }, { id, featured: !currentFeatured });
  };

  useEffect(() => {
    // Lấy danh sách danh mục để map với sản phẩm
    getCategoryHierarchy((res) => {
      if (res.statusCode === 200) {
        const flatCategories = res.data.flatCategories;
        const categoryMapping = {};
        
        // Tạo map danh mục với thông tin đường dẫn
        flatCategories.forEach(category => {
          let path = category.name;
          if (category.level > 0) {
            path = `${'-'.repeat(category.level)} ${category.name}`;
          }
          
          categoryMapping[category._id] = {
            ...category,
            path
          };
        });
        
        setCategoryMap(categoryMapping);
        
        // Sau khi có danh sách danh mục, lấy danh sách sản phẩm
        getListProducts(handleGetProducts);
      }
    });
  }, []);

  const columns = [
    {
      field: 'name',
      headerName: 'Tên sản phẩm',
      width: 200,
      editable: false,
    },
    {
      field: 'category_path',
      headerName: 'Danh mục',
      width: 180,
      editable: false,
    },
    {
      field: 'image',
      headerName: 'Hình ảnh',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <div>
          {params.value && params.value.length > 0 && 
            <img 
              style={{width: 'auto', height: '48px', maxWidth: '100%'}} 
              src={params.value[0].file_url} 
              alt="product" 
            />
          }
        </div>
      )
    },
    {
      field: 'price',
      headerName: 'Giá',
      width: 120,
      editable: false,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value);
      }
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <div>
          <button
            className={`btn btn-sm ${params.value ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => handleToggleStatus(params.row._id, params.value)}
            title={params.value ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
            style={{ marginRight: '5px' }}
          >
            {params.value ? '👁️' : '⊘'}
          </button>
          <Chip 
            label={params.value ? "Hiển thị" : "Ẩn"} 
            color={params.value ? "primary" : "default"} 
            size="small"
          />
        </div>
      )
    },
    {
      field: 'featured',
      headerName: 'Nổi bật',
      width: 120,
      editable: false,
      renderCell: (params) => (
        <div>
          <button
            className={`btn btn-sm ${params.value ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => handleToggleFeatured(params.row._id, params.value)}
            title={params.value ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
          >
            {params.value ? '★' : '☆'}
          </button>
        </div>
      )
    },
    {
      field: '_id',
      headerName: 'Thao tác',
      sortable: false,
      width: 180,
      renderCell: (params) => (
        <div>
          <button 
            className='btn btn-sm btn-primary mr-2' 
            onClick={() => moveToEditAdd(params.id)}
            style={{marginRight: '8px'}}
          >
            Sửa
          </button>
          <button 
            className='btn btn-sm btn-danger' 
            onClick={() => handleOpenModal(params.id)}
          >
            Xóa
          </button>
        </div>
      )
    },
  ];
  
  return (
    <div className="hotel">
      <div className="hotel-header">
        <h5 className='ml-3'>Danh sách sản phẩm</h5>
        <button className="btn btn-success mb-3" onClick={moveToProductAdd}>Thêm sản phẩm mới</button>
      </div>
      <div>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={listProducts}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row._id}
            rowsPerPageOptions={[10, 20, 50]}
            checkboxSelection
            disableSelectionOnClick
            loading={loading}
          />
        </Box>
      </div>
      <CheckModalComponent 
          open={openModal}
          handleCloseModal={handleCloseModal} 
          modalAccept={handleDeleteProduct}
      />
    </div>
  );
}

export default ProductsComponent;