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
import FormHelperText from '@mui/material/FormHelperText';
import { AddProduct, editProduct, getListProductDetail } from '../Services/Products';
import { uploadMultiFile } from '../firebase/uploadFile';
import RichTextEditor from './RichTextEditor';
import ProductImageUploader from './ProductImageUploader';

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
      name: Yup.string().required().min(6, 'Tối thiểu 6 ký tự').max(100),
      price: Yup.string().required(),
      description_sale: Yup.string().required(),
      description_detail: Yup.string().required(),
      categoryId: Yup.string().required()
    }),
    onSubmit: (values, action) => {
      // Handle form submission
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
  const [productImages, setProductImages] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [status, setStatus] = useState(true);

  const [errors, setErrors] = useState({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  // Không cần cấu hình modules và formats cho TinyMCE

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    } else if (name.trim().length < 6) {
      newErrors.name = 'Tên sản phẩm phải có ít nhất 6 ký tự';
    } else if (name.trim().length > 200) {
      newErrors.name = 'Tên sản phẩm không được vượt quá 200 ký tự';
    }

    if (!price || price <= 0) {
      newErrors.price = 'Giá sản phẩm là bắt buộc và phải lớn hơn 0';
    }

    if (!descriptionSale.trim()) {
      newErrors.descriptionSale = 'Mô tả ngắn là bắt buộc';
    }

    if (!descriptionDetail.trim()) {
      newErrors.descriptionDetail = 'Mô tả chi tiết là bắt buộc';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Danh mục là bắt buộc';
    }

    if (productImages.length === 0) {
      newErrors.images = 'Ít nhất một hình ảnh là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addProduct = async () => {
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    const getCategoryName = listCategory.filter(obj => obj._id === categoryId);


    // Prepare images data with new structure
    const imagesData = productImages.map((img, index) => ({
      url: img.url,
      isPrimary: img.isPrimary,
      order: index
    }));



    let data = {
      id: product_id,
      role,
      name,
      price,
      category_id: getCategoryName[0]._id,
      description_sale: descriptionSale,
      description_detail: descriptionDetail,
      status,

      images: imagesData
    }

    if (product_id && product_id !== 'new') {
      editProduct((res) => {
        if (res.statusCode === 200) {
          navigate('/home/products');
        } else {
          alert('Cập nhật sản phẩm thất bại!');
        }
      }, data)
    } else {
      AddProduct((res) => {
        if (res.statusCode === 200) {
          navigate('/home/products');
        } else {
          alert('Thêm sản phẩm thất bại!');
        }
      }, data);
    }
  }

  const handleChangeCategory = (ev) => {
    setCategoryId(ev.target.value);
    clearError('categoryId');
  }

  // Handle image changes from ProductImageUploader
  const handleImagesChange = (images) => {
    setProductImages(images);
    if (images.length > 0) {
      clearError('images');
    }
  };

  const handlePrimaryImageChange = (index) => {
    setPrimaryImageIndex(index);
  };

  // Clear specific error when user starts typing
  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
    }
  };

  useEffect(() => {
    // Load categories first
    setIsLoadingCategories(true);
    getCategoryHierarchy((res) => {
      if (res.statusCode === 200) {
        setListCategory(res.data.flatCategories || []);
      }
      setIsLoadingCategories(false);
    });
  }, []);

  // Load product data after categories are loaded (for edit mode)
  useEffect(() => {
    if (product_id !== 'new' && listCategory.length > 0 && !isLoadingCategories) {
      setIsLoadingProduct(true);
      getListProductDetail((res) => {
        if (res.statusCode === 200) {
          const product = res.data;
          setName(product.name);
          // Handle populated category_id (could be object or string)
          const categoryIdValue = typeof product.category_id === 'object'
            ? product.category_id._id
            : product.category_id;
          setCategoryId(categoryIdValue);
          setDescriptionSale(product.description_sale);
          setDescriptionDetail(product.description_detail);
          setPrice(product.price);
          setStatus(product.status !== false);


          // Check if category exists in list
          const categoryExists = listCategory.find(cat => cat._id === categoryIdValue);

          if (!categoryExists) {
            // Category not found in current list - this might happen during loading
          }

          // Handle existing images with new structure
          if (product.images && product.images.length > 0) {
            // Find the first primary image or default to first image
            let primaryIndex = product.images.findIndex(img => typeof img === 'object' && img.isPrimary);
            if (primaryIndex === -1) primaryIndex = 0;

            const formattedImages = product.images.map((img, index) => ({
              id: `existing_${index}`,
              file: null,
              url: typeof img === 'string' ? img : img.url,
              isPrimary: index === primaryIndex, // Only one image should be primary
              order: typeof img === 'object' ? img.order : index,
              uploadStatus: 'success'
            }));
            setProductImages(formattedImages);
            setPrimaryImageIndex(primaryIndex);
          }
        }
        setIsLoadingProduct(false);
      }, { id: product_id })
    }
  }, [product_id, listCategory, isLoadingCategories]);

  // Track categoryId changes for validation
  useEffect(() => {
    if (categoryId && listCategory.length > 0) {
      const found = listCategory.find(cat => cat._id === categoryId);
      // Category validation can be added here if needed
    }
  }, [categoryId, listCategory]);

  return (
    <div className="hotel-add">
      <div className='hotel-add-header'>
        {
          product_id !== 'new' ? <h3>Edit Product</h3> : <h3>Add New Product</h3>
        }
      </div>

      <div className='hotel-add-content row'>
        <div className='col-12 mb-3'>
          <small className="text-muted">
            <span className="text-danger">*</span> Các trường bắt buộc
          </small>
        </div>

        <div className='col-6 form-item'>
          <TextField
            id="product-name"
            label={
              <span>
                Tên sản phẩm
              </span>
            }
            variant="outlined"
            className='form-input-add'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError('name');
            }}
            error={!!errors.name}
            helperText={errors.name || (name ? '✓ Tên sản phẩm hợp lệ' : 'Nhập tên sản phẩm (tối thiểu 6 ký tự)')}
            required
            fullWidth
            InputProps={{
              style: {
                backgroundColor: errors.name ? '#ffebee' : (name ? '#e8f5e8' : 'white')
              }
            }}
          />
        </div>

        <div className='col-6 form-item'>
          <TextField
            id="product-price"
            label={
              <span>
                Giá sản phẩm
              </span>
            }
            variant="outlined"
            className='form-input-add'
            value={price}
            type='number'
            onChange={(e) => {
              setPrice(e.target.value);
              clearError('price');
            }}
            error={!!errors.price}
            helperText={errors.price || (price ? '✓ Giá sản phẩm hợp lệ' : 'Nhập giá sản phẩm (VNĐ)')}
            required
            fullWidth
            InputProps={{
              style: {
                backgroundColor: errors.price ? '#ffebee' : (price ? '#e8f5e8' : 'white')
              }
            }}
          />
        </div>

        <div className='col-12 form-item'>
          <TextField
            id="product-description-sale"
            label={
              <span>
                Mô tả ngắn
              </span>
            }
            variant="outlined"
            className='form-input-add'
            value={descriptionSale}
            multiline
            rows={3}
            onChange={(e) => {
              setDescriptionSale(e.target.value);
              clearError('descriptionSale');
            }}
            error={!!errors.descriptionSale}
            helperText={errors.descriptionSale || (descriptionSale ? '✓ Mô tả ngắn hợp lệ' : 'Nhập mô tả ngắn để hiển thị trong chi tiết sản phẩm')}
            required
            fullWidth
            placeholder="Mô tả ngắn gọn về sản phẩm"
            InputProps={{
              style: {
                backgroundColor: errors.descriptionSale ? '#ffebee' : (descriptionSale ? '#e8f5e8' : 'white')
              }
            }}
          />
        </div>

        <div className='col-12 form-item'>
          <div className="mb-2">
            <label className="form-label" style={{ fontWeight: 'bold', color: '#333' }}>
              Mô tả chi tiết
              <span className="text-danger ms-1" style={{ fontSize: '16px' }}>*</span>
            </label>
            <small className="text-muted d-block" style={{ fontSize: '12px', marginTop: '2px' }}>
              Mô tả đầy đủ về sản phẩm, tính năng, ưu điểm (hiển thị trong trang chi tiết)
            </small>
          </div>
          <RichTextEditor
            value={descriptionDetail}
            onChange={(value) => {
              setDescriptionDetail(value);
              clearError('descriptionDetail');
            }}
            placeholder="Nhập mô tả chi tiết sản phẩm với định dạng rich text và bảng..."
            error={!!errors.descriptionDetail}
          />
          {errors.descriptionDetail ? (
            <div className="text-danger mt-2" style={{ fontSize: '13px', fontWeight: 'bold' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                ⚠️ {errors.descriptionDetail}
              </span>
            </div>
          ) : descriptionDetail ? (
            <div className="text-success mt-2" style={{ fontSize: '12px' }}>
              ✓ Mô tả chi tiết đã được nhập
            </div>
          ) : (
            <div className="text-muted mt-2" style={{ fontSize: '12px' }}>
              Sử dụng toolbar để định dạng text, thêm hình ảnh, link, bảng, v.v.
            </div>
          )}
        </div>

        <div className='col-6 form-item'>
          <FormControlLabel
            control={<Switch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
            label="Active Status"
          />
        </div>



        <div className='col-12 mt-4'>
          <label>Hình ảnh sản phẩm</label>
          <ProductImageUploader
            images={productImages}
            onImagesChange={handleImagesChange}
            primaryImageIndex={primaryImageIndex}
            onPrimaryImageChange={handlePrimaryImageChange}
            maxImages={10}
          />
          {errors.images && (
            <div className="text-danger mt-2" style={{ fontSize: '12px' }}>
              {errors.images}
            </div>
          )}
        </div>

        <div className='col-12 mt-4'>
          <div className="mb-2">
            <label className="form-label" style={{ fontWeight: 'bold', color: '#333' }}>
              Danh mục sản phẩm
              <span className="text-danger ms-1" style={{ fontSize: '16px' }}>*</span>
            </label>
            <small className="text-muted d-block" style={{ fontSize: '12px', marginTop: '2px' }}>
              Vui lòng chọn danh mục phù hợp cho sản phẩm
            </small>
          </div>
          <FormControl
            style={{ width: '100%' }}
            error={!!errors.categoryId}
            variant="outlined"
          >
            <InputLabel
              id="category-select-label"
              style={{
                color: errors.categoryId ? '#d32f2f' : (categoryId ? '#1976d2' : '#666'),
                fontWeight: errors.categoryId ? 'bold' : 'normal'
              }}
            >
              {isLoadingCategories ? 'Đang tải...' : 'Chọn danh mục *'}
            </InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={isLoadingCategories ? '' : categoryId}
              label="Chọn danh mục *"
              onChange={(e) => handleChangeCategory(e)}
              required
              disabled={isLoadingCategories}
              key={`category-select-${categoryId}-${listCategory.length}`}
              style={{
                backgroundColor: errors.categoryId ? '#ffebee' : (categoryId ? '#e3f2fd' : 'white'),
                borderColor: errors.categoryId ? '#d32f2f' : (categoryId ? '#1976d2' : '#ccc')
              }}
            >
              {isLoadingCategories ? (
                <MenuItem disabled>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                    Đang tải danh mục...
                  </div>
                </MenuItem>
              ) : listCategory.length === 0 ? (
                <MenuItem disabled>
                  <span style={{ color: '#f44336' }}>Không có danh mục nào</span>
                </MenuItem>
              ) : (
                listCategory.map((obj, key) => {
                  // Hiển thị phân cấp bằng cách thêm dấu gạch ngang phía trước
                  const levelPrefix = obj.level ? '— '.repeat(obj.level) : '';
                  return (
                    <MenuItem
                      key={key}
                      value={obj._id}
                      style={{
                        paddingLeft: `${16 + (obj.level || 0) * 20}px`,
                        fontWeight: obj.level === 0 ? 'bold' : 'normal',
                        color: obj.level === 0 ? '#1976d2' : '#333'
                      }}
                    >
                      {levelPrefix}{obj.name}
                    </MenuItem>
                  )
                })
              )}
            </Select>
            {errors.categoryId ? (
              <FormHelperText error style={{ fontWeight: 'bold', fontSize: '13px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚠️ {errors.categoryId}
                </span>
              </FormHelperText>
            ) : categoryId && (
              <FormHelperText style={{ color: '#4caf50', fontSize: '12px' }}>
                ✓ Danh mục đã được chọn
              </FormHelperText>
            )}
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