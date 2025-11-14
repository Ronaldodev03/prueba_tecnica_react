import { useState, useEffect } from "react";
import { getBooks, createBook, deleteBook } from "../api/books";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error al obtener los libros:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createBook({ title });
      setTitle("");
      fetchBooks();
    } catch (error) {
      setError(error.response?.data?.error || "Error al crear el libro");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Estás seguro de eliminar este libro?")) return;

    try {
      setDeletingId(id);
      await deleteBook(id);
      fetchBooks();
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title"
            className="flex-1 bg-transparent border border-gray-600 rounded-lg px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="border border-gray-600 rounded-lg px-8 py-4 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {books.length > 0 && (
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book._id}
                className="border border-gray-700 rounded-lg px-6 py-4 flex items-center justify-between hover:border-gray-600 transition-colors"
              >
                <span className="text-white">{book.title}</span>
                <button
                  onClick={() => handleDelete(book._id)}
                  disabled={deletingId === book._id}
                  className="border border-gray-600 rounded-lg px-6 py-2 text-white hover:bg-red-900/20 hover:border-red-500 transition-colors"
                >
                  {deletingId === book._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}

        {books.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No hay libros agregados
          </div>
        )}
      </div>
    </div>
  );
}

export default BooksPage;
