// services/bookService.ts

export interface Author {
    id: number;
    first_name: string;
    last_name: string;
}

export interface Publisher {
    id: number;
    name: string;
}

export interface Book {
  id: number;
  title: string;
  description: string;
  author_id: number;
  publisher_id: number;
  price: number;
  published_year: number;
  author: Author;
  publisher: Publisher;
}

export interface BookResponse {
  data: Book[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBooks(
  page: number,
  search: string,
  sort: string
): Promise<BookResponse> {
  const token = getCookie("token");

  const res = await fetch(
    `${API_URL}/books?page=${page}&search=${search}&sort=${sort}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Book API Error:", errorText);
    throw new Error("Failed fetching books");
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


export async function createBook(data: any) {

    const token = getCookie("token");
    const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create book");
    return await res.json();
}

export async function updateBook(id: number, data: any) {

    const token = getCookie("token");
    const res = await fetch(`${API_URL}/books/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
        throw new Error(responseData.error || "Failed to update book");
    }

    return responseData;
}

export async function deleteBook(id: number) {

    const token = getCookie("token");
    const res = await fetch(`${API_URL}/books/${id}`, {
        method: "DELETE",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to delete book");
    return true;
}

export async function getAuthorsList() {
    const res = await fetch(`${API_URL}/authors/list`);
    if (!res.ok) throw new Error("Failed fetching authors");
    return await res.json();
}

export async function getPublishersList() {
    const res = await fetch(`${API_URL}/publishers/list`);
    if (!res.ok) throw new Error("Failed fetching publishers");
    return await res.json();
}
