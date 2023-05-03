import { API_URL } from "../Constants/ApiConstant";


export function AddCategory(callback, data) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    fetch(`${API_URL}/add-category`,  {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: {...data,role},
        withCredentials: true,
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => console.log(err));
}

export function getCategories(callback) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-categories`,  {
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

export function deleteCategory(callback, id) {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/delete-category`,  {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({id,role}),
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => console.log(err));
}