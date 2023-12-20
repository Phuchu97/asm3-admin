import { Box, Button, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFileSlideMiddle, AddslideMiddle, deleteSlideMiddle } from '../Services/SlideMiddle';
import { uploadFile, deleteFile } from "../firebase/uploadFile";
import '../css/slides.css';
import { toast } from 'react-toastify';

function SlideMiddleComponent() {

  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [listImages, setListImages] = useState([]);
  const [activeModal, setActiveModal] = useState(false);

  const handleAddSlide = async (ev) => {
    const files = ev.target.files;
    const file = await uploadFile(files[0]);
    if (file) {
      AddslideMiddle((res) => {
        if (res.statusCode === 200) {
          getFileSlideMiddle(hanldeGetFile);
        }
      }, { id, name, description, files: [...listImages, file] });
    } else {
      alert("Lỗi trong quá trình upload ảnh!")
    };
  };

  const handleSend = async (ev) => {
    AddslideMiddle((res) => {
      if (res.statusCode === 200) {
        getFileSlideMiddle(hanldeGetFile);
        toast.success("Sửa thành công!", {className: 'toast-message'});
      }
    }, { id, name, description, files: listImages });
  };

  const hanldeGetFile = (res) => {
    if (res.statusCode === 200) {
      console.log(res);
      setListImages(res.data[0].image);
      setId(res.data[0]._id);
      setName(res.data[0].name);
      setDescription(res.data[0].description);
    }
  }

  const handleDeleteSlide = (item) => {
    deleteSlideMiddle((res) => {
      if (res.statusCode === 200) {
        getFileSlideMiddle(hanldeGetFile);
        deleteFile(item);
      }
    }, {id, item})
  };

  const handleActiveMove = () => {
    setActiveModal(true)
  };

  const handleActiveLeave = () => {
    setActiveModal(false)
  };

  useEffect(() => {
    getFileSlideMiddle(hanldeGetFile);
  }, []);
  return (
    <Grid container marginLeft={4}>
      <Grid item xs={12} sm={12} md={12} lg={12} marginBottom={4}>
        <Box>
          <TextField
            id="standard-basic"
            label="Tên Công Ty"
            name='photos'
            variant="standard"
            className='form-input-add form-category'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} marginBottom={4}>
        <Box>
          <TextField
            id="standard-basic"
            label="Mô tả"
            name='photos'
            variant="standard"
            className='form-input-add form-category'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} marginBottom={4}>
        <Grid className="list-slide-image row">
          {
            listImages != undefined && listImages.map((obj, key) => {
              return (
                <Grid key={key} className=" col-3">
                  <Grid
                    className="list-slide-image-item"
                    onMouseLeave={handleActiveLeave}
                    onMouseMove={handleActiveMove}
                  >
                    <Grid onClick={() => handleDeleteSlide(obj)} className={activeModal ? 'modal-handle-image active' : 'modal-handle-image'}>
                      <Grid className="modal-handle-image-content">
                        <span><i className="fa-solid fa-trash-can"></i></span>
                        <span>Delete</span>
                      </Grid>
                    </Grid>
                    <img style={{ objectFit: 'cover' }} src={obj} alt="slide ảnh" />
                  </Grid>
                </Grid>
              )
            })
          }
          <label className="col-3 btn-add-slide">
            <input type="file" multiple className="hidden" onChange={handleAddSlide} />
            <img style={{ marginRight: '0.5rem' }} src={require('../assets/img/images.png')} alt="" />
            Upload File
          </label>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12}>
        <button className='btn form-btn-submit' onClick={handleSend}>Send</button>
      </Grid>
    </Grid>
  );
}

export default SlideMiddleComponent;