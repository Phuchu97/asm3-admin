import { useState, useEffect } from 'react';
import '../css/products.css'
import TextField from '@mui/material/TextField';
import { getCategories } from '../Services/Category';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AddProduct, editProduct,getListProductDetail } from '../Services/Products';

function ProductAddComponent() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description_sale: '',
      description_detail: '',
      categoryId: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required().min(6,'Tối thiểu 6 ký tự').max(100),
      price: Yup.string().required(),
      description_sale: Yup.string().required(),
      description_detail: Yup.string().required(),
      categoryId: Yup.string().required()
    }),
    onSubmit: (values, action) => {
      console.log(values);
    }
  });
  const role = localStorage.getItem('role');
  const { product_id } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [listCategory, setListCategory] = useState([]);
  const [descriptionSale, setDescriptionSale] = useState('');
  const [descriptionDetail, setDescriptionDetail] = useState('');
  const [imagesProduct, setImagesProduct] = useState([]);

  const addProduct = () => {
    const formProduct = new FormData();
    for(let i = 0; i < imagesProduct.length;i++) {
      formProduct.append(`photos`, imagesProduct[i]);
    }
    const getCategoryName = listCategory.filter(obj => obj._id === categoryId);
    formProduct.append('id',product_id);
    formProduct.append('role',role);
    formProduct.append('name',name);
    formProduct.append('price',price);
    formProduct.append('category_id',getCategoryName[0]._id);
    formProduct.append('category_name',getCategoryName[0].name);
    formProduct.append('description_sale',descriptionSale);
    formProduct.append('description_detail',descriptionDetail);
    if(product_id) {
      editProduct((res) => {
        console.log(res);
      }, formProduct)
    } else {
      AddProduct((res) => {
        console.log(res);
      },formProduct)
    }
  }

  const handleChangeCategory = (ev) => {
    setCategoryId(ev.target.value);
  }

  const handleAddSlide = (ev) => {
    setImagesProduct(ev.target.files)
  };

  useEffect(() => {
    getCategories((res) => {
      setListCategory(res.data);
    });
    if(product_id !== 'new') {
      getListProductDetail((res) => {
        console.log(res);
        setName(res.data.name);
        setCategoryId(res.data.category_id);
        setDescriptionSale(res.data.description_sale);
        setDescriptionDetail(res.data.description_detail);
        setPrice(res.data.price);
      },{id: product_id})
    }
  }, []);
  
  return (
    <div className="hotel-add">
        <div className='hotel-add-header'>
          {
            product_id !== 'new'? <h3>Edit Product</h3> : <h3>Add New Product</h3>
          }
        </div>

        <div className='hotel-add-content row'>

          <div className='col-6 form-item'>
            <TextField 
              id="standard-basic" 
              label="Name" 
              variant="standard" 
              className='form-input-add'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className='col-6 form-item'>
            <TextField 
              id="standard-basic" 
              label="Price" 
              variant="standard" 
              className='form-input-add'
              value={price}
              type='number'
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className='col-6 form-item'>
            <TextField 
              id="standard-basic" 
              label="Description sale" 
              variant="standard" 
              className='form-input-add'
              value={descriptionSale}
              multiline
              onChange={(e) => setDescriptionSale(e.target.value)}
            />
          </div>


          <div className='col-6 form-item'>
            <TextField 
              id="standard-basic" 
              label="Description detail"
              variant="standard" 
              multiline
              className='form-input-add'
              value={descriptionDetail}
              onChange={(e) => setDescriptionDetail(e.target.value)}
            />
          </div>

          <div className=" list-slide-image col-6">
                <input type="file" multiple placeholder='Choose file' onChange={(e) => handleAddSlide(e)} />
          </div>

          <div className='col-6'>
            <FormControl style={{width: '85%'}}>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryId}
                label="Category"
                onChange={(e) => handleChangeCategory(e)}
              >
                {
                  listCategory.length > 0 && listCategory.map((obj,key) => {
                    return (
                      <MenuItem key={key} value={obj._id}>{obj.name}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </div>

          <div className='col-3'>
            <button className='btn form-btn-submit' onClick={addProduct}>{product_id? 'Edit Product' : 'Save Product'}</button>
          </div>
          
        </div>
    </div>
  );
}

export default ProductAddComponent;