import { useState, useEffect } from 'react';
import '../css/category-add.css'
import TextField from '@mui/material/TextField';
import { useNavigate, useParams } from 'react-router-dom';
import { updateCategory, getCategoryHierarchy, getCategoryById } from '../Services/Category';
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
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [order, setOrder] = useState(0);
  const [parentId, setParentId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to check if a category is a descendant of current category
  const isDescendant = (categoryId, currentId, categoriesData) => {
    const category = categoriesData.find(cat => cat._id === categoryId);
    if (!category || !category.parent_id) return false;
    if (category.parent_id === currentId) return true;
    return isDescendant(category.parent_id, currentId, categoriesData);
  };

  // Helper function to render category options with indentation
  const renderCategoryOption = (category) => {
    const indent = '— '.repeat(category.level || 0);
    return `${indent}${category.name}`;
  };

  // Lấy danh sách danh mục và thông tin danh mục hiện tại
  useEffect(() => {
    let currentCategory = null;
    
    // Lấy thông tin danh mục hiện tại trước
    getCategoryById((res) => {
      if (res.statusCode === 200) {
        currentCategory = res.data;
        setCategoryName(currentCategory.name);
        setDescription(currentCategory.description || '');
        setStatus(currentCategory.status);
        setOrder(currentCategory.order || 0);
        
        // Lấy danh sách danh mục hierarchy để hiển thị danh mục cha
        getCategoryHierarchy((hierarchyRes) => {
          if (hierarchyRes.statusCode === 200) {
            const flatCategories = hierarchyRes.data.flatCategories || hierarchyRes.data;
            // Lọc bỏ danh mục hiện tại và các danh mục con của nó để tránh circular reference
            const filteredCategories = flatCategories.filter(cat => {
              return cat._id !== id && !isDescendant(id, cat._id, flatCategories);
            });
            setCategories(filteredCategories);
            
            // Chỉ set parentId nếu parent category vẫn có trong filtered list
            const parentExists = currentCategory.parent_id && 
              filteredCategories.some(cat => cat._id === currentCategory.parent_id);
            setParentId(parentExists ? currentCategory.parent_id : '');
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }, id);
  }, [id]);

  const handleUpdateCategory = () => {
    if(categoryName === '') {
      alert('Vui lòng nhập tên danh mục');
      return;
    }

    const data = {
      id,
      name: categoryName,
      description,
      status,
      order,
      parent_id: parentId || null
    };

    updateCategory((res) => {
      if (res.statusCode === 200) {
        navigate('/home/categories');
      } else {
        alert(res.message || 'Cập nhật danh mục thất bại!');
      }
    }, data);
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
                <MenuItem key={category._id} value={category._id} style={{ fontFamily: 'monospace' }}>
                  {renderCategoryOption(category)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className='col-12'>
          <button className='btn form-btn-submit' onClick={handleUpdateCategory}>Update Category</button>
        </div>
      </div>
    </div>
  );
}

export default CategoryEditComponent; 