import { useState, useEffect } from 'react';
import '../css/category-add.css'
import TextField from '@mui/material/TextField';
import { useNavigate, useParams } from 'react-router-dom';
import { updateCategory, getCategories, getCategoryById } from '../Services/Category';
import { uploadFile } from '../firebase/uploadFile';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function CategoryEditComponent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [order, setOrder] = useState(0);
  const [parentId, setParentId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách danh mục và thông tin danh mục hiện tại
  useEffect(() => {
    // Lấy danh sách danh mục để hiển thị danh mục cha
    getCategories((res) => {
      if (res.statusCode === 200) {
        // Lọc bỏ danh mục hiện tại ra khỏi danh sách để tránh chọn chính nó làm cha
        setCategories(res.data.filter(cat => cat._id !== id));
      }
    });

    // Lấy thông tin danh mục hiện tại
    getCategoryById((res) => {
      if (res.statusCode === 200) {
        const category = res.data;
        setCategoryName(category.name);
        setDescription(category.description || '');
        setStatus(category.status);
        setOrder(category.order || 0);
        setParentId(category.parent_id || '');
        setCurrentImage(category.image);
      }
      setLoading(false);
    }, id);
  }, [id]);

  const handleUpdateCategory = async () => {
    let imageUrl = currentImage;
    
    // Nếu có hình ảnh mới, upload lên
    if (categoryImage) {
      const file = await uploadFile(categoryImage);
      if (!file) return alert('Có lỗi trong quá trình tải ảnh');
      imageUrl = file;
    }

    const data = {
      id,
      name: categoryName,
      description,
      status,
      order,
      parent_id: parentId || null,
      image: imageUrl
    };

    updateCategory((res) => {
      if (res.statusCode === 200) {
        navigate('/home/categories');
      } else {
        alert('Cập nhật danh mục thất bại!');
      }
    }, data);
  };

  const handleFile = (ev) => {
    setCategoryImage(ev.target.files[0]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hotel-add">
      <div className='hotel-add-header'>
        <h3 style={{ marginLeft: '2rem' }}>Edit Category</h3>
      </div>

      <div className='hotel-add-content row'>
        <div className='col-12 form-item'>
          <TextField
            id="standard-basic"
            label="Name Category"
            name='photos'
            variant="standard"
            className='form-input-add form-category'
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>

        <div className='col-12 form-item'>
          <TextField
            id="description"
            label="Description"
            variant="standard"
            multiline
            rows={4}
            className='form-input-add form-category'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className='col-6 form-item'>
          <TextField
            id="order"
            label="Sort Order"
            variant="standard"
            type="number"
            className='form-input-add form-category'
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
          />
        </div>

        <div className='col-6 form-item'>
          <FormControlLabel
            control={<Switch checked={status} onChange={(e) => setStatus(e.target.checked)} />}
            label="Active Status"
            className='ml-4'
          />
        </div>

        <div className='col-12 form-item'>
          <FormControl style={{ width: '100%' }}>
            <InputLabel id="parent-category-label">Danh mục cha</InputLabel>
            <Select
              labelId="parent-category-label"
              id="parent-category-select"
              value={parentId}
              label="Danh mục cha"
              onChange={(e) => setParentId(e.target.value)}
            >
              <MenuItem value="">
                <em>Không có danh mục cha</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="col-12 form-item">
          {currentImage && (
            <div className="mb-3">
              <p>Hình ảnh hiện tại:</p>
              <img 
                src={currentImage} 
                alt={categoryName} 
                style={{ maxHeight: '150px', marginBottom: '10px' }} 
              />
            </div>
          )}
          <label className="col-3 btn-add-slide">
            <input type="file" onChange={(e) => handleFile(e)} />
            <span>Chọn ảnh mới (không bắt buộc)</span>
          </label>
        </div>

        <div className='col-12'>
          <button className='btn form-btn-submit' onClick={handleUpdateCategory}>Update Category</button>
        </div>
      </div>
    </div>
  );
}

export default CategoryEditComponent; 