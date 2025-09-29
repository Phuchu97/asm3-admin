import { API_URL } from "../Constants/ApiConstant";

export function AddslideMiddle(callback, data) {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/add-slide-middle`,  {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...data, role}),
        withCredentials: true,
    })
      .then(res => res.json())
      .then(callback)
      .catch((err) => callback({ error: true, message: err.message || 'Network error' }));
}

export function getFileSlideMiddle(callback) {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/get-slide-middle`,  {
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