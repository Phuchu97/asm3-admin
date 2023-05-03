import { Outlet, useNavigate,Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { API_URL } from "../Constants/ApiConstant";
import { getFileSlide,Addslide,deleteSlide } from "../Services/SlideService";
import '../css/slides.css'

function SlideComponent() {

    const[activeModal, setActiveModal] = useState(false);
    const[slideImages,setSlideImages] = useState([]);

    const handleAddSlide = (ev) => {
        const files = ev.target.files;
        const data = new FormData();
        for(let i = 0; i < files.length;i++) {
            data.append(`photos`, files[i])
        }
        Addslide((res) => {
            if(res.statusCode === 200) {
                getFileSlide(hanldeGetFile);
            } else {
                console.log(res.message);
            }
        },data);
    };

    const hanldeGetFile = (res) => {
        if(res.statusCode === 200) {
            setSlideImages(res.data);
        }
    }

    const handleDeleteSlide = (id) => {
        deleteSlide((res) => {
            if(res.statusCode === 200) {
                getFileSlide(hanldeGetFile);
            }
        }, id)
    };

    const handleActiveMove = () => {
        setActiveModal(true)
    };

    const handleActiveLeave = () => {
        setActiveModal(false)
    };

    useEffect(() => {
        getFileSlide(hanldeGetFile);
    }, [])

  return (
    <div className="slide">
        <h1 className="slide-title">Slide Image</h1>
        <div className="list-slide-image row">
            {
               slideImages != undefined && slideImages.map((obj,key) => {
                    return (
                        <div key={key} className=" col-3">
                            <div 
                                className="list-slide-image-item" 
                                onMouseLeave={handleActiveLeave} 
                                onMouseMove={handleActiveMove}
                            >
                                <div onClick={() => handleDeleteSlide(obj._id)} className={activeModal? 'modal-handle-image active' : 'modal-handle-image'}>
                                    <div className="modal-handle-image-content">
                                        <span><i class="fa-solid fa-trash-can"></i></span>
                                        <span>Delete</span>
                                    </div>
                                </div>
                                <img src={API_URL+'/'+obj.image.file_url} alt="slide ảnh" />
                            </div>
                        </div>
                    )
                })
            }
            <label className="col-3 btn-add-slide">
                <input type="file" multiple className="hidden" onChange={handleAddSlide} />
                <img style={{marginRight: '0.5rem'}} src={require('../assets/img/images.png')} alt="" />
                Upload File
            </label>
        </div>
    </div>
  );
}

export default SlideComponent;