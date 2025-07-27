import { useState, useEffect } from 'react';
import '../css/category-add.css'
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { AddCategory, getCategories } from '../Services/Category';
import { uploadFile } from '../firebase/uploadFile';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function CategoryAddComponent() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [order, setOrder] = useState(0);
  const [parentId, setParentId] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories((res) => {
      if (res.statusCode === 200) {
        setCategories(res.data);
      }
    });
  }, []);

  const addCategory = async () => {
    if(categoryImage === undefined || categoryName == '') return;
    const file = await uploadFile(categoryImage);
    if(!file) return alert('Có lỗi trong quá trình tải ảnh');
    let data = {
      file,
      name: categoryName,
      description,
      status,
      order,
      parent_id: parentId || null
    }
    AddCategory((res) => {
      if(res.statusCode === 200) {
        navigate('/home/categories')
      }
    }, data)
  }

  const handleFile = (ev) => {
    setCategoryImage(ev.target.files[0])
  }

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

          <div className="list-slide-image col-12 form-item">
            <label className="col-3 btn-add-slide">
                <input type="file" multiple onChange={(e) => handleFile(e)} />
            </label>
          </div>

          <div className='col-12'>
            <button className='btn form-btn-submit' onClick={addCategory}>Send</button>
          </div>
          
        </div>
    </div>
  );
}

export default CategoryAddComponent;