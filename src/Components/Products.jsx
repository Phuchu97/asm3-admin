import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../Constants/ApiConstant';
import { getListProducts, deleteProduct } from '../Services/Products';
import CheckModalComponent from '../Modals/CheckModal';

function ProductsComponent() {
  
  const navigate = useNavigate();
  const [listProducts, setListProducts] = useState([]);
  const [currentIdProduct, setCurrentIdProduct] = useState('');

  // Modal check accept
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (id) => {
    setOpenModal(true);
    setCurrentIdProduct(id);
  };

  const handleCloseModal = () => {
    setOpenModal(false)
  };

  //

  const moveToProductAdd = () => {
    navigate('/home/product-add');
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
    setListProducts(res.data);
  }

  useEffect(() => {
    getListProducts(handleGetProducts);
  }, [])

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: true,
    },
    {
      field: 'category_product',
      headerName: 'Category name',
      width: 150,
      editable: true,
    },
    {
      field: 'image',
      headerName: 'Image',
      width: 110,
      editable: true,
      renderCell: (params) => (
        <div>
          {params.value.length > 0 && <img style={{width: '135%', height: '48px'}} src={API_URL+'/'+params.value[0].file_url} alt="product" />}
        </div>
      )
    },
    {
      field: 'description_sale',
      headerName: 'Description sale',
      width: 200,
      editable: true,
    },
    {
      field: 'description_detail',
      headerName: 'Description detail',
      width: 200,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      editable: true,
    },
    {
      field: '_id',
      headerName: 'Action',
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <div>
          <button className='btn btn-success mr-2' onClick={() => moveToEditAdd(params.id)}>
            Edit
          </button>
          <button className='btn btn-danger' onClick={() => handleOpenModal(params.id)}>
            Delete
          </button>
        </div>
      )
    },
  ];
  
  return (
    <div className="hotel">
      <div className="hotel-header">
        <h5 className='ml-3'>Products List</h5>
        <button className="btn btn-success mb-3" onClick={moveToProductAdd}>Add New</button>
      </div>
      <div>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={listProducts}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row._id}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
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