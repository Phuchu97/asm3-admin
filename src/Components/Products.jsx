import { Box, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { getListProducts, deleteProduct, updateProductStatus } from '../Services/Products';
import { getCategoryHierarchy } from '../Services/Category';
import CheckModalComponent from '../Modals/CheckModal';

function ProductsComponent() {
  
  const navigate = useNavigate();
  const [listProducts, setListProducts] = useState([]);
  const [currentIdProduct, setCurrentIdProduct] = useState('');
  const [categories, setCategories] = useState([]);
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

  // Function to get category path - handle both populated and non-populated category_id
  const getCategoryPath = (categoryData) => {
    // Handle populated category (object with _id, name, slug)
    if (typeof categoryData === 'object' && categoryData !== null) {
      if (categoryData.name) {
        // Already populated, just return the name
        return categoryData.name;
      }
      // If it's an object but no name, try to find by _id
      categoryData = categoryData._id;
    }
    
    // Handle string category_id - find in categories list
    if (typeof categoryData === 'string') {
      // If categories not loaded yet, return loading message
      if (categories.length === 0) {
        return 'Đang tải...';
      }
      
      const category = categories.find(cat => cat._id === categoryData);
      if (!category) {
        return 'Không xác định';
      }
      
      let path = category.name;
      let currentCategory = category;
      
      // Build path by traversing up the hierarchy
      while (currentCategory.parent_id) {
        const parent = categories.find(cat => cat._id === currentCategory.parent_id);
        if (parent) {
          path = `${parent.name} > ${path}`;
          currentCategory = parent;
        } else {
          break;
        }
      }
      
      return path;
    }
    
    return 'Không xác định';
  };

  // Function to refresh category paths for all products
  const refreshCategoryPaths = () => {
    if (listProducts.length > 0) {
      const updatedProducts = listProducts.map(product => ({
        ...product,
        category_path: getCategoryPath(product.category_id)
      }));
      setListProducts(updatedProducts);
    }
  };

  const handleGetProducts = (res) => {
    if (res.statusCode === 200) {
      // Add category path to products using simplified logic
      const productsWithCategoryInfo = res.data.map(product => {
        const categoryPath = getCategoryPath(product.category_id);
        
        return {
          ...product,
          category_path: categoryPath
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
  


  useEffect(() => {
    // Load categories first, then products
    getCategoryHierarchy((res) => {
      if (res.statusCode === 200) {
        setCategories(res.data.flatCategories || []);
      }
    });
  }, []);

  // Load products when categories are available
  useEffect(() => {
    if (categories.length > 0) {
      getListProducts(handleGetProducts);
    } else {
      // Fallback: Load products anyway after a delay if categories fail to load
      const fallbackTimer = setTimeout(() => {
        getListProducts(handleGetProducts);
      }, 3000);
      
      return () => clearTimeout(fallbackTimer);
    }
  }, [categories]);

  // Re-process products when categories are loaded (for cases where products loaded first)
  useEffect(() => {
    if (categories.length > 0 && listProducts.length > 0) {
      const updatedProducts = listProducts.map(product => ({
        ...product,
        category_path: getCategoryPath(product.category_id)
      }));
      setListProducts(updatedProducts);
    }
  }, [categories]);

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
      renderCell: (params) => {
        const categoryPath = params.value || getCategoryPath(params.row.category_id);
        return (
          <div style={{ 
            color: categoryPath === 'Đang tải...' ? '#666' : 'inherit',
            fontStyle: categoryPath === 'Đang tải...' ? 'italic' : 'normal'
          }}>
            {categoryPath}
          </div>
        );
      }
    },
    {
      field: 'images',
      headerName: 'Hình ảnh',
      width: 120,
      editable: false,
      renderCell: (params) => {
        const images = params.value || [];
        if (images.length === 0) return <div>Không có ảnh</div>;
        
        // Find primary image or use first image
        const primaryImage = images.find(img => img.isPrimary) || images[0];
        const imageUrl = typeof primaryImage === 'string' ? primaryImage : 
                        (primaryImage.url || primaryImage.file_url);
        
        return (
          <div>
            <img 
              style={{width: 'auto', height: '48px', maxWidth: '100%'}} 
              src={imageUrl} 
              alt="product" 
            />
          </div>
        );
      }
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
        <div>
          <button className="btn btn-success mb-3 mr-2" onClick={moveToProductAdd}>Thêm sản phẩm mới</button>
          <button className="btn btn-secondary mb-3" onClick={refreshCategoryPaths} title="Làm mới danh mục">
            🔄 Làm mới danh mục
          </button>
        </div>
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