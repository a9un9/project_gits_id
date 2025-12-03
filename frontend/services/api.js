export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet(endpoint) {

    const token = localStorage.getItem("token");
    
    return await fetch(`${API_URL}/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json());
}
