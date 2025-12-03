"use client";

import { useEffect, useState } from "react";
import { getBooks, Book, BookResponse, createBook, updateBook, deleteBook, getAuthorsList, getPublishersList } from "@/services/bookService";

import DashboardLayout from "@/components/DashboardLayout";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title_asc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [authorsList, setAuthorsList] = useState<{id: number, first_name: string, last_name: string}[]>([]);
  const [publishersList, setPublishersList] = useState<{id: number, name: string}[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    published_year: 0,
    author_id: 0,
    publisher_id: 0,
  });

  async function loadBooks() {
    try {
      setLoading(true);
      setError("");

      const res: BookResponse = await getBooks(page, search, sort);

      setBooks(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err.message ?? "Error fetching books");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, [page, search, sort]);

  useEffect(() => {
    async function loadMetaData() {
      try {
        const authorsRes = await getAuthorsList();
        setAuthorsList(authorsRes);

        const publishersRes = await getPublishersList();
        setPublishersList(publishersRes);
      } catch (err) {
        console.error("Failed to load authors or publishers", err);
      }
    }

    loadMetaData();
  }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({
          title: "",
          description: "",
          price: 0,
          published_year: 0,
          author_id: 0,
          publisher_id: 0,
        });
        setShowModal(true);
    };

    const openEdit = (book: Book) => {
      setEditing(book);
      setForm({
        title: book.title,
        description: book.description,
        price: book.price,
        published_year: book.published_year,
        author_id: book.author_id,
        publisher_id: book.publisher_id,
      });
      setShowModal(true);
    };
    
    const handleSubmit = async () => {
      try {
        
        setModalLoading(true);
  
        if (editing) {
          await updateBook(editing.id, form);
        } else {
          await createBook(form);
        }
  
        setShowModal(false);
        loadBooks();
      } catch (err: any) {
        alert("Gagal menyimpan data: " + (err.message || ""));
      } finally {
        setModalLoading(false);
      }
    };
  
    const handleDelete = async (id: number) => {
      if (!confirm("Yakin ingin menghapus?")) return;
  
      try {
        await deleteBook(id);
        loadBooks();
      } catch {
        alert("Gagal menghapus");
      }
    };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Books</h1>

      {/* Filter */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search book..."
            className="border px-3 py-2 rounded w-64"
            onChange={(e) => setSearch(e.target.value)}
          />

        <button
          onClick={openCreate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Book
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Error */}
      {error && (
        <p className="text-red-600 bg-red-100 px-3 py-2 rounded">{error}</p>
      )}

      {/* Table */}
      {!loading && !error && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">No.</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Published Year</th>
              <th className="p-2 border">Author</th>
              <th className="p-2 border">Publisher</th>
              <th className="p-2 border w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td
                  className="text-center p-3 border"
                  colSpan={7}
                >
                  No data found
                </td>
              </tr>
            ) : (
              books.map((b, i) => (
                <tr key={b.id}>
                  <td className="p-2 border">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                  <td className="p-2 border">{b.title}</td>
                  <td className="p-2 border">{b.description}</td>
                  <td className="p-2 border text-right">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(b.price)}
                  </td>
                  <td className="p-2 border text-center">{b.published_year}</td>
                  <td className="p-2 border">{(b.author.first_name ?? "") + " " + (b.author.last_name ?? "")}</td>
                  <td className="p-2 border">{b.publisher.name}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => openEdit(b)}
                      className="bg-blue-500 px-2 py-1 text-white rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bg-red-500 px-2 py-1 text-white rounded"
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={meta.current_page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <p>
          Page {meta.current_page} of {meta.last_page}
        </p>

        <button
          disabled={meta.current_page === meta.last_page}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="text-lg font-bold mb-3">
                {editing ? "Edit Author" : "Add Author"}
              </h2>

              <label className="block mb-1 font-medium">Title</label>
              <input
                className="border p-2 w-full mb-3"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <label className="block mb-1 font-medium">Description</label>
              <input
                className="border p-2 w-full mb-3"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <label className="block mb-1 font-medium">Price (in IDR)</label>
              <input
                className="border p-2 w-full mb-3"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) })
                }
              />

              <label className="block mb-1 font-medium">Published Year</label>
              <input
                className="border p-2 w-full mb-3"
                placeholder="Published Year"
                value={form.published_year}
                onChange={(e) =>
                  setForm({ ...form, published_year: parseInt(e.target.value) })
                }
              />

              {/* Author */}
              <label className="block mb-1 font-medium">Author</label>
              <select
                className="border p-2 w-full mb-3"
                value={form.author_id}
                onChange={(e) => setForm({ ...form, author_id: parseInt(e.target.value) })}
              >
                <option value={0}>Select Author</option>
                {authorsList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.first_name} {a.last_name}
                  </option>
                ))}
              </select>

              {/* Publisher */}
              <label className="block mb-1 font-medium">Publisher</label>
              <select
                className="border p-2 w-full mb-3"
                value={form.publisher_id}
                onChange={(e) => setForm({ ...form, publisher_id: parseInt(e.target.value) })}
              >
                <option value={0}>Select Publisher</option>
                {publishersList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSubmit}
                  className="px-3 py-2 bg-blue-600 text-white rounded"
                  disabled={modalLoading}
                >
                  {modalLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    </DashboardLayout>
  );
}
