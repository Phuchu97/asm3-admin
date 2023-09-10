import { useEffect, useState } from 'react';
import { API_URL } from "../Constants/ApiConstant";
import { getFileSlide, Addslide, deleteSlide } from "../Services/SlideService";
import '../css/slides.css';
import { uploadFile, deleteFile } from "../firebase/uploadFile";

function SlideComponent() {

    const [activeModal, setActiveModal] = useState(false);
    const [slideImages, setSlideImages] = useState([]);

    const handleAddSlide = async (ev) => {
        const files = ev.target.files;
        const file = await uploadFile(files[0]);
        console.log(file);
        if (file) {
            Addslide((res) => {
                if (res.statusCode === 200) {
                    getFileSlide(hanldeGetFile);
                } else {
                    console.log(res.message);
                }
            }, {file: `${file}`});
        } else {
            alert("Lỗi trong quá trình upload ảnh!")
        };
    };

    const hanldeGetFile = (res) => {
        if (res.statusCode === 200) {
            console.log(res);
            setSlideImages(res.data);
        }
    }

    const handleDeleteSlide = (item) => {
        console.log(item);
        deleteSlide((res) => {
            if (res.statusCode === 200) {
                getFileSlide(hanldeGetFile);
                deleteFile(item.image);
            }
        }, item._id)
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
                    slideImages != undefined && slideImages.map((obj, key) => {
                        return (
                            <div key={key} className=" col-3">
                                <div
                                    className="list-slide-image-item"
                                    onMouseLeave={handleActiveLeave}
                                    onMouseMove={handleActiveMove}
                                >
                                    <div onClick={() => handleDeleteSlide(obj)} className={activeModal ? 'modal-handle-image active' : 'modal-handle-image'}>
                                        <div className="modal-handle-image-content">
                                            <span><i class="fa-solid fa-trash-can"></i></span>
                                            <span>Delete</span>
                                        </div>
                                    </div>
                                    <img src={obj.image} alt="slide ảnh" />
                                </div>
                            </div>
                        )
                    })
                }
                <label className="col-3 btn-add-slide">
                    <input type="file" multiple className="hidden" onChange={handleAddSlide} />
                    <img style={{ marginRight: '0.5rem' }} src={require('../assets/img/images.png')} alt="" />
                    Upload File
                </label>
            </div>
        </div>
    );
}

export default SlideComponent;