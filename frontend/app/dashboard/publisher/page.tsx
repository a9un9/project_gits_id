"use client";

import { useEffect, useState } from "react";
import { getPublishers, Publisher, PublisherResponse, createPublisher, updatePublisher, deletePublisher } from "@/services/publisherService";

import DashboardLayout from "@/components/DashboardLayout";

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name_asc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Publisher | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    country: "",
  });


  async function loadPublishers() {
    try {
      setLoading(true);
      setError("");

      const res: PublisherResponse = await getPublishers(page, search, sort);

      setPublishers(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err.message ?? "Error fetching publishers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPublishers();
  }, [page, search, sort]);
  
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", country: "" });
    setShowModal(true);
  };

  const openEdit = (publisher: Publisher) => {
    setEditing(publisher);
    setForm({
      name: publisher.name,
      country: publisher.country ?? "",
    });
    setShowModal(true);
  };
  
  const handleSubmit = async () => {
    try {
      
      setModalLoading(true);

      if (editing) {
        await updatePublisher(editing.id, form);
      } else {
        await createPublisher(form);
      }

      setShowModal(false);
      loadPublishers();
    } catch (err: any) {
      alert("Gagal menyimpan data: " + (err.message || ""));
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus?")) return;

    try {
      await deletePublisher(id);
      loadPublishers();
    } catch {
      alert("Gagal menghapus");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Publishers</h1>

      {/* Filter */}
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search publisher..."
            className="border px-3 py-2 rounded w-64"
            onChange={(e) => setSearch(e.target.value)}
          />

        <button
          onClick={openCreate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Publisher
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
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Country</th>
              <th className="p-2 border w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {publishers.length === 0 ? (
              <tr>
                <td
                  className="text-center p-3 border"
                  colSpan={4}
                >
                  No data found
                </td>
              </tr>
            ) : (
              publishers.map((p, i) => (
                <tr key={p.id}>
                  <td className="p-2 border">{(meta.current_page - 1) * meta.per_page + i + 1}</td>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.country}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => openEdit(p)}
                      className="bg-blue-500 px-2 py-1 text-white rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
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

              <label className="block mb-1 font-medium">Name</label>
              <input
                className="border p-2 w-full mb-3"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <label className="block mb-1 font-medium">Country</label>
              <input
                className="border p-2 w-full mb-3"
                placeholder="Country"
                value={form.country}
                onChange={(e) =>
                  setForm({ ...form, country: e.target.value })
                }
              />

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
