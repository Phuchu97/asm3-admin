import { API_URL } from "../Constants/ApiConstant";

export function Uploadslide(callback, data) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/upload-slide`,  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => console.log(err));
}

export function Addslide(callback, data) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/add-slide`,  {
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

export function getFileSlide(callback) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-slide`,  {
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

export function deleteSlide(callback, id) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/delete-slide`,  {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({id: id}),
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => console.log(err));
}