import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../Constants/ApiConstant';
import { uploadFile } from '../firebase/uploadFile';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function BlogAdd() {
  const navigate = useNavigate();
  
  // State cho form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Cấu hình editor
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'font',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image',
    'color', 'background',
    'blockquote', 'code-block'
  ];

  // Xử lý khi chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!title.trim()) {
        throw new Error('Tiêu đề không được để trống');
      }
      
      if (!content.trim()) {
        throw new Error('Nội dung không được để trống');
      }

      if (!image) {
        throw new Error('Ảnh không được để trống');
      }
      
      // Upload ảnh nếu có
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadFile(image);
      }
      
      // Xử lý tags
      const tagsList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      // Gọi API tạo bài viết
      const response = await axios.post(
        `${API_URL}/admin/blogs`,
        {
          title,
          content,
          summary: summary || null,
          image: imageUrl,
          tags: tagsList,
          is_published: isPublished
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Nếu thành công, quay về trang danh sách
      if (response.data && response.data.data) {
        navigate('/home/blog');
      }
    } catch (error) {
      // Xử lý lỗi
      console.error('Error creating blog:', error);
      setError(error.response?.data?.message || error.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Thêm Bài Viết Mới</h1>
      </div>
      
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Thông tin bài viết</h6>
        </div>
        <div className="card-body">
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Tiêu đề */}
            <div className="form-group">
              <label htmlFor="title">Tiêu đề <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control text-gray-800"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>
            
            {/* Tóm tắt */}
            <div className="form-group">
              <label htmlFor="summary">Tóm tắt</label>
              <textarea
                className="form-control"
                id="summary"
                rows="3"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Nhập tóm tắt bài viết (không bắt buộc)"
              ></textarea>
            </div>
            
            {/* Nội dung */}
            <div className="form-group">
              <label htmlFor="content">Nội dung <span className="text-danger">*</span></label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Nhập nội dung bài viết"
                style={{ minHeight: '100px', marginBottom: '50px' }}
              />
            </div>
            
            {/* Ảnh đại diện */}
            <div className="form-group">
              <label htmlFor="image">Ảnh đại diện <span className="text-danger">*</span></label>
              <input
                type="file"
                className="form-control-file text-gray-800"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="img-thumbnail" 
                    style={{ maxHeight: '200px' }} 
                  />
                </div>
              )}
            </div>
            
            {/* Tags */}
            <div className="form-group">
              <label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                className="form-control"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Ví dụ: thép, sản phẩm, tin tức"
              />
            </div>
            
            {/* Trạng thái */}
            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <label className="custom-control-label" htmlFor="isPublished">
                  Xuất bản ngay
                </label>
              </div>
            </div>
            
            {/* Nút submit */}
            <hr />
            <div className="form-group row">
              <div className="col-sm-6">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-block" 
                  onClick={() => navigate('/home/blog')}
                  disabled={loading}
                >
                  Hủy
                </button>
              </div>
              <div className="col-sm-6">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block" 
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </span>
                  ) : (
                    'Tạo bài viết'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BlogAdd;