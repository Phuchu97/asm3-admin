import { useState, useEffect } from 'react';
import '../css/products.css'
import TextField from '@mui/material/TextField';
import { getCategoryHierarchy } from '../Services/Category';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { AddProduct, editProduct, getListProductDetail } from '../Services/Products';
import { uploadMultiFile } from '../firebase/uploadFile';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  const [status, setStatus] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [specifications, setSpecifications] = useState({});
  const [keywords, setKeywords] = useState('');

  // Cấu hình editor
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image',
    'color', 'background',
    'blockquote', 'code-block'
  ];

  const addProduct = async() => {
    let listImages;
    if(imagesProduct.length > 0) {
      listImages = await uploadMultiFile(imagesProduct);
    }
    const getCategoryName = listCategory.filter(obj => obj._id === categoryId);
    
    // Chuyển keywords từ string thành array
    const keywordsArray = keywords
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword !== '');
    
    let data = {
      id: product_id,
      role,
      name,
      price,
      category_id: getCategoryName[0]._id,
      description_sale: descriptionSale,
      description_detail: descriptionDetail,
      status,
      featured,
      specifications,
      keywords: keywordsArray,
      files: listImages
    }
    
    if(product_id && product_id !== 'new') {
      editProduct((res) => {
        if(res.statusCode === 200) {
          navigate('/home/products');
        } else {
          alert('Cập nhật sản phẩm thất bại!');
        }
      }, data)
    } else {
      AddProduct((res) => {
        if(res.statusCode === 200) {
          navigate('/home/products');
        } else {
          alert('Thêm sản phẩm thất bại!');
        }
      }, data);
    }
  }

  const handleChangeCategory = (ev) => {
    setCategoryId(ev.target.value);
  }

  const handleAddSlide = (ev) => {
    setImagesProduct(ev.target.files)
  };

  // Thêm hoặc cập nhật thuộc tính kỹ thuật
  const addSpecification = () => {
    const newSpecs = { ...specifications };
    newSpecs[`spec_${Object.keys(specifications).length + 1}`] = {
      name: '',
      value: ''
    };
    setSpecifications(newSpecs);
  };

  const updateSpecification = (key, field, value) => {
    const newSpecs = { ...specifications };
    newSpecs[key] = {
      ...newSpecs[key],
      [field]: value
    };
    setSpecifications(newSpecs);
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
  };

  useEffect(() => {
    getCategoryHierarchy((res) => {
      if(res.statusCode === 200) {
        setListCategory(res.data.flatCategories || []);
      }
    });
    
    if(product_id !== 'new') {
      getListProductDetail((res) => {
        if(res.statusCode === 200) {
          const product = res.data;
          setName(product.name);
          setCategoryId(product.category_id);
          setDescriptionSale(product.description_sale);
          setDescriptionDetail(product.description_detail);
          setPrice(product.price);
          setStatus(product.status !== false);
          setFeatured(product.featured === true);
          setSpecifications(product.specifications || {});
          setKeywords(product.keywords ? product.keywords.join(', ') : '');
        }
      }, {id: product_id})
    }
  }, [product_id]);
  
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

          <div className='col-12 form-item'>
            <TextField 
              id="standard-basic" 
              label="Description sale" 
              variant="standard" 
              className='form-input-add'
              value={descriptionSale}
              multiline
              rows={3}
              onChange={(e) => setDescriptionSale(e.target.value)}
            />
          </div>

          <div className='col-12 form-item'>
            <label>Description detail</label>
            <ReactQuill
              theme="snow"
              value={descriptionDetail}
              onChange={setDescriptionDetail}
              modules={modules}
              formats={formats}
              placeholder="Nhập mô tả chi tiết sản phẩm"
              style={{ minHeight: '200px', marginBottom: '50px' }}
            />
          </div>
          
          <div className='col-6 form-item'>
            <FormControlLabel 
              control={<Switch checked={status} onChange={(e) => setStatus(e.target.checked)} />} 
              label="Active Status" 
            />
          </div>
          
          <div className='col-6 form-item'>
            <FormControlLabel 
              control={<Switch checked={featured} onChange={(e) => setFeatured(e.target.checked)} />} 
              label="Featured Product" 
            />
          </div>

          <div className='col-12'>
            <TextField 
              id="keywords" 
              label="Keywords (phân cách bằng dấu phẩy)" 
              variant="standard" 
              className='form-input-add'
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className='col-12 mt-4'>
            <h4>Thông số kỹ thuật</h4>
            <button 
              type="button" 
              className="btn btn-sm btn-primary" 
              onClick={addSpecification}
              style={{ marginBottom: '10px' }}
            >
              Thêm thông số
            </button>
            
            {Object.keys(specifications).map(key => (
              <div className="row mb-2" key={key}>
                <div className="col-5">
                  <TextField 
                    label="Tên thông số" 
                    variant="outlined" 
                    size="small"
                    value={specifications[key].name} 
                    onChange={(e) => updateSpecification(key, 'name', e.target.value)}
                    fullWidth
                  />
                </div>
                <div className="col-5">
                  <TextField 
                    label="Giá trị" 
                    variant="outlined" 
                    size="small"
                    value={specifications[key].value} 
                    onChange={(e) => updateSpecification(key, 'value', e.target.value)}
                    fullWidth
                  />
                </div>
                <div className="col-2">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger"
                    onClick={() => removeSpecification(key)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="list-slide-image col-12 mt-4">
            <label>Hình ảnh sản phẩm</label>
            <input 
              type="file" 
              multiple 
              placeholder='Choose file' 
              onChange={(e) => handleAddSlide(e)} 
              className="form-control-file"
            />
          </div>

          <div className='col-12 mt-4'>
            <FormControl style={{width: '100%'}}>
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
                    // Hiển thị phân cấp bằng cách thêm dấu gạch ngang phía trước
                    const levelPrefix = obj.level ? '- '.repeat(obj.level) : '';
                    return (
                      <MenuItem key={key} value={obj._id}>
                        {levelPrefix}{obj.name}
                      </MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </div>

          <div className='col-12 mt-4'>
            <button className='btn form-btn-submit' onClick={addProduct}>
              {product_id && product_id !== 'new' ? 'Update Product' : 'Save Product'}
            </button>
          </div>
          
        </div>
    </div>
  );
}

export default ProductAddComponent;