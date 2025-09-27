import React, { useState, useRef, useEffect } from 'react';
import { uploadMultiFile } from '../firebase/uploadFile';
import '../css/product-image-uploader.css';

const ProductImageUploader = ({ 
  images = [], 
  onImagesChange, 
  primaryImageIndex = 0, 
  onPrimaryImageChange,
  maxImages = 10,
  maxFileSize = 5 * 1024 * 1024 // 5MB
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)' };
    }
    
    if (file.size > maxFileSize) {
      return { valid: false, error: 'File quá lớn. Tối đa 5MB' };
    }
    
    return { valid: true };
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    
    if (images.length + fileArray.length > maxImages) {
      alert(`Chỉ được upload tối đa ${maxImages} ảnh`);
      return;
    }

    const validFiles = [];
    for (const file of fileArray) {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        alert(`${file.name}: ${validation.error}`);
      }
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    
    try {
      const newImages = validFiles.map((file, index) => ({
        id: `temp_${Date.now()}_${index}`,
        file: file,
        url: URL.createObjectURL(file),
        isPrimary: images.length === 0 && index === 0,
        order: images.length + index,
        uploadStatus: 'pending'
      }));

      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);

      const uploadedUrls = await uploadMultiFile(validFiles);
      
      const finalImages = updatedImages.map((img, index) => {
        if (img.uploadStatus === 'pending') {
          const uploadIndex = index - images.length;
          return {
            ...img,
            url: uploadedUrls[uploadIndex],
            uploadStatus: 'success'
          };
        }
        return img;
      });

      onImagesChange(finalImages);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload thất bại. Vui lòng thử lại.');
      
      const filteredImages = images.filter(img => img.uploadStatus !== 'pending');
      onImagesChange(filteredImages);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    
    if (images.find(img => img.id === imageId)?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
      onPrimaryImageChange(0);
    }
    
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      order: index
    }));
    
    onImagesChange(reorderedImages);
  };

  const setPrimaryImage = (index) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    
    onImagesChange(updatedImages);
    onPrimaryImageChange(index);
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      order: index
    }));
    
    onImagesChange(reorderedImages);
    
    if (images[fromIndex].isPrimary) {
      onPrimaryImageChange(toIndex);
    }
  };

  return (
    <div className="product-image-uploader">
      <div className="upload-section">
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          
          <div className="upload-content">
            {uploading ? (
              <div className="upload-loading">
                <div className="spinner"></div>
                <p>Đang upload...</p>
              </div>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <p className="upload-text">
                  Kéo thả ảnh vào đây hoặc <span className="upload-link">click để chọn</span>
                </p>
                <p className="upload-info">
                  Hỗ trợ: JPEG, PNG, WebP. Tối đa {maxImages} ảnh, mỗi ảnh tối đa 5MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="images-preview">
          <h4>Ảnh sản phẩm ({images.length}/{maxImages})</h4>
          <p className="primary-info">Click vào ảnh để chọn làm ảnh chính</p>
          
          <div className="images-grid">
            {images.map((image, index) => (
              <div 
                key={image.id} 
                className={`image-item ${image.isPrimary ? 'primary' : ''}`}
              >
                <div className="image-container">
                  <img 
                    src={image.url} 
                    alt={`Product ${index + 1}`}
                    className="image-preview"
                    onClick={() => setPrimaryImage(index)}
                  />
                  
                  {image.isPrimary && (
                    <div className="primary-badge">
                      <span>Ảnh chính</span>
                    </div>
                  )}
                  
                  <div className="image-actions">
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeImage(image.id)}
                      title="Xóa ảnh"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="image-controls">
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn-move"
                        onClick={() => moveImage(index, index - 1)}
                        title="Di chuyển lên"
                      >
                        ↑
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        className="btn-move"
                        onClick={() => moveImage(index, index + 1)}
                        title="Di chuyển xuống"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="image-info">
                  <p className="image-order">#{index + 1}</p>
                  {image.uploadStatus === 'pending' && (
                    <p className="upload-status">Đang upload...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageUploader;