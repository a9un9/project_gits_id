// services/authorService.ts
export interface Author {
    id: number;
    first_name: string;
    last_name: string;
    bio?: string;
}

export interface AuthorResponse {
    data: Author[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAuthors(
    page: number,
    search: string,
    sort: string
    ): Promise<AuthorResponse> {
    const token = getCookie("token");

    const res = await fetch(
        `${API_URL}/authors?page=${page}&search=${search}&sort=${sort}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        }
    );

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Author API Error:", errorText);
        throw new Error("Failed fetching authors");
    }

    const json = await res.json();

    if (!json.meta) {
        throw new Error("Invalid API response: missing meta");
    }

    return json;
}

function getCookie(name: string) {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="))
        ?.split("=")[1];
}


export async function createAuthor(data: any) {

    const token = getCookie("token");
    const res = await fetch(`${API_URL}/authors`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create author");
    return await res.json();
}

export async function updateAuthor(id: number, data: any) {

    const token = getCookie("token");
    const res = await fetch(`${API_URL}/authors/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
        throw new Error(responseData.error || "Failed to update author");
    }

    return responseData;
}

export async function deleteAuthor(id: number) {

    const token = getCookie("token");
    const res = await fetch(`${API_URL}/authors/${id}`, {
        method: "DELETE",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to delete author");
    return true;
}