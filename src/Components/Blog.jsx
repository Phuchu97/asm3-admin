import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../Constants/ApiConstant';
import LoadingSpinner from '../Modals/CheckModal';

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const itemsPerPage = 10;
  
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Chuẩn bị tham số
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        order: sortOrder,
        search: searchTerm
      };
      
      // Gọi API
      const response = await axios.get(`${API_URL}/admin/blogs`, {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data && response.data.data) {
        setBlogs(response.data.data);
        
        if (response.data.meta) {
          setTotalPages(response.data.meta.totalPages);
        }
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Tải blogs khi tham số thay đổi
  useEffect(() => {
    fetchBlogs();
  }, [currentPage, sortBy, sortOrder]);
  
  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };
  
  // Xử lý sắp xếp
  const handleSort = (field) => {
    if (sortBy === field) {
      // Nếu đã sắp xếp theo field này, đảo ngược thứ tự
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Nếu chuyển sang field mới, mặc định là desc
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Hiển thị xác nhận xóa
  const handleShowDeleteConfirm = (blog) => {
    setSelectedBlog(blog);
    setShowDeleteConfirm(true);
  };
  
  // Xóa bài viết
  const handleDelete = async () => {
    if (!selectedBlog) return;
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/admin/blogs/${selectedBlog._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Tải lại danh sách sau khi xóa
      fetchBlogs();
      setShowDeleteConfirm(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format ngày
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
  
  // Cắt ngắn nội dung
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    
    // Loại bỏ thẻ HTML
    const plainText = text.replace(/<[^>]*>/g, '');
    
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Quản lý Blog</h1>
        <Link
          to="/home/blog/add"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-plus fa-sm text-white-50 mr-2"></i>
          Thêm bài viết mới
        </Link>
      </div>
      
      {/* Tìm kiếm */}
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
          <h6 className="m-0 font-weight-bold text-primary">Tìm kiếm Bài Viết</h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="input-group-append">
                <button className="btn btn-primary" type="submit">
                  <i className="fas fa-search fa-sm"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Bảng danh sách bài viết */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Danh sách bài viết</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="blogsTable" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                    Tiêu đề {sortBy === 'title' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th>Mô tả</th>
                  <th>Tags</th>
                  <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>
                    Ngày tạo {sortBy === 'created_at' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <LoadingSpinner show={true} />
                    </td>
                  </tr>
                ) : blogs.length > 0 ? (
                  blogs.map(blog => (
                    <tr key={blog._id}>
                      <td className="text-center" style={{ width: "100px" }}>
                        <img 
                          src={blog.image || '/placeholder.jpg'} 
                          alt={blog.title} 
                          className="img-fluid" 
                          style={{ maxHeight: "60px" }}
                        />
                      </td>
                      <td>{blog.title}</td>
                      <td>{truncateText(blog.summary || blog.content)}</td>
                      <td>
                        {blog.tags && blog.tags.map((tag, index) => (
                          <span key={index} className="badge badge-info mr-1">{tag}</span>
                        ))}
                      </td>
                      <td>{formatDate(blog.created_at)}</td>
                      <td>
                        <span className={`badge badge-${blog.is_published ? 'success' : 'warning'}`}>
                          {blog.is_published ? 'Đã xuất bản' : 'Chưa xuất bản'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <a 
                            href={`http://localhost:3000/tin-tuc/${blog.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-info"
                            title="Xem trước"
                          >
                            <i className="fas fa-eye"></i>
                          </a>
                          <Link 
                            to={`/home/blog/edit/${blog._id}`} 
                            className="btn btn-sm btn-primary mx-1"
                            title="Sửa"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            title="Xóa"
                            onClick={() => handleShowDeleteConfirm(blog)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Không có dữ liệu bài viết
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Phân trang */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Trước
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(page)}>
                      {page}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
      
      {/* Modal xác nhận xóa */}
      {showDeleteConfirm && selectedBlog && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button type="button" className="close" onClick={() => setShowDeleteConfirm(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa bài viết "<strong>{selectedBlog.title}</strong>"?</p>
                <p className="text-danger">Lưu ý: Hành động này không thể hoàn tác!</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </span>
                  ) : (
                    'Xác nhận xóa'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;