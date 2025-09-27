import { API_URL } from "../Constants/ApiConstant";


export function AddProduct(callback, data) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/add-product`,  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
        withCredentials: true,
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => callback({ error: true, message: err.message || 'Network error' }));
}


export function getListProducts(callback, options = {}) {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams(options).toString();
    const url = `${API_URL}/get-products${queryParams ? `?${queryParams}` : ''}`;
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => callback({ error: true, message: err.message || 'Network error' }));
}

export function getProductsByCategory(callback, categoryId) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-products-by-category/${categoryId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => callback({ error: true, message: err.message || 'Network error' }));
}

export function editProduct(callback, data) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    fetch(`${API_URL}/edit-product`,  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
        withCredentials: true,
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => callback({ error: true, message: err.message || 'Network error' }));
}

export function getListProductDetail(callback, data) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-product-detail`,  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => callback({ error: true, message: err.message || 'Network error' }));
}

export function deleteProduct(callback, data) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    fetch(`${API_URL}/delete-product`,  {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...data,role}),
        withCredentials: true,
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => callback({ error: true, message: err.message || 'Network error' }));
}

export function updateProductStatus(callback, data) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    fetch(`${API_URL}/update-product-status`,  {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...data, role}),
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => callback({ error: true, message: err.message || 'Network error' }));
}

export function updateProductFeatured(callback, data) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    fetch(`${API_URL}/update-product-featured`,  {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...data, role}),
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => callback({ error: true, message: err.message || 'Network error' }));
}