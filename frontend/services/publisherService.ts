// services/publisherService.ts
export interface Publisher {
  id: number;
  name: string;
  country: string;
}

export interface PublisherResponse {
  data: Publisher[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPublishers(
  page: number,
  search: string,
  sort: string
): Promise<PublisherResponse> {
  const token = getCookie("token");

  const res = await fetch(
    `${API_URL}/publishers?page=${page}&search=${search}&sort=${sort}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Publisher API Error:", errorText);
    throw new Error("Failed fetching publishers");
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


export async function createPublisher(data: any) {

    const token = getCookie("token");
    const res = await fetch(`${API_URL}/publishers`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create publisher");
    return await res.json();
}

export async function updatePublisher(id: number, data: any) {

    const token = getCookie("token");
    const res = await fetch(`${API_URL}/publishers/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
        throw new Error(responseData.error || "Failed to update publisher");
    }

    return responseData;
}

export async function deletePublisher(id: number) {

    const token = getCookie("token");
    const res = await fetch(`${API_URL}/publishers/${id}`, {
        method: "DELETE",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Failed to delete publisher");
    return true;
}