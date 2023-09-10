import { useState, useEffect } from 'react';
import '../css/category-add.css'
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { AddCategory } from '../Services/Category';
import { uploadFile } from '../firebase/uploadFile';

function CategoryAddComponent() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);

  const addCategory = async () => {
    if(categoryImage === undefined || categoryName == '') return;
    const file = await uploadFile(categoryImage);
    if(!file) return alert('Có lỗi trong quá trình tải ảnh');
    let data = {
      file,
      name: categoryName
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