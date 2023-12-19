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
      .catch((err) => console.log(err));
}


export function getListProducts(callback) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-products`,  {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => console.log(err));
}

export function editProduct(callback, data) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    fetch(`${API_URL}/edit-product`,  {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: data,
        withCredentials: true,
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => console.log(err));
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
      .catch((err) => console.log(err));
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
      .catch((err) => console.log(err));
}