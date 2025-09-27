import { useState, useEffect } from 'react';
import '../css/category-add.css'
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { AddCategory, getCategoryHierarchy } from '../Services/Category';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function CategoryAddComponent() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [order, setOrder] = useState(0);
  const [parentId, setParentId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategoryHierarchy((res) => {
      if (res.statusCode === 200) {
        // Use flatCategories for hierarchical dropdown display
        const flatCategories = res.data.flatCategories || res.data;
        // Chỉ hiển thị categories cấp 0 và 1 (level 0 và 1)
        const filteredCategories = flatCategories.filter(category => 
          (category.level || 0) <= 1
        );
        setCategories(filteredCategories);
      }
    });
  }, []);

  const addCategory = () => {
    if(categoryName === '') {
      alert('Vui lòng nhập tên danh mục');
      return;
    }
    
    let data = {
      name: categoryName,
      description,
      status,
      order,
      parent_id: parentId || null
    }
    
    AddCategory((res) => {
      if(res.statusCode === 200) {
        navigate('/home/categories')
      } else {
        alert(res.message || 'Có lỗi xảy ra khi thêm danh mục');
      }
    }, data)
  }

  // Helper function to render category options with indentation
  const renderCategoryOption = (category) => {
    const indent = '— '.repeat(category.level || 0);
    return `${indent}${category.name}`;
  };

  return (
    <div className="hotel-add">
        <div className='hotel-add-header'>
            <h3 style={{marginLeft: '2rem'}}>Add New Category</h3>
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
            <FormControl style={{width: '100%'}}>
              <InputLabel id="parent-category-label">Danh mục cha</InputLabel>
              <Select
                labelId="parent-category-label"
                id="parent-category-select"
                value={parentId}
                label="Danh mục cha"
                onChange={(e) => setParentId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Không có danh mục cha (Tạo danh mục cấp 1)</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id} style={{ fontFamily: 'monospace' }}>
                    {renderCategoryOption(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              <strong>Lưu ý:</strong> Chỉ có thể tạo danh mục tối đa cấp 2. Nếu chọn danh mục cha cấp 1, sẽ tạo danh mục cấp 2.
            </div>
          </div>

          <div className='col-12'>
            <button className='btn form-btn-submit' onClick={addCategory}>Send</button>
          </div>
          
        </div>
    </div>
  );
}

export default CategoryAddComponent;