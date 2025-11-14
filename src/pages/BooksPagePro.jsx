import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBooks, createBook, deleteBook } from "../api/books";
import { bookSchema } from "../schemas/bookSchema";

function BooksPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
    },
  });

  const {
    data: books = [],
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
  });

  // Mutación para crear libro
  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      reset();
    },
  });

  // Mutación para eliminar libro
  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const onSubmit = async (data) => {
    await createBookMutation.mutateAsync(data);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este libro?")) return;
    setDeletingId(id);
    try {
      await deleteBookMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  // Estado de loading combinado
  const isCreating = isSubmitting || createBookMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 flex gap-4">
          <div className="flex-1">
            <input
              {...register("title")}
              type="text"
              placeholder="Título del libro"
              className="w-full bg-transparent border border-gray-600 rounded-lg px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="border border-gray-600 rounded-lg px-8 py-4 text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isCreating ? "Adding..." : "Add"}
          </button>
        </form>

        {errors.title && (
          <p className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {errors.title.message}
          </p>
        )}

        {/* Mensaje de error de creación */}
        {createBookMutation.isError && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {createBookMutation.error instanceof Error
              ? createBookMutation.error.message
              : "Error al crear el libro"}
          </div>
        )}

        {/* Mensaje de error de fetch */}
        {fetchError && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            Error al cargar los libros
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="text-center text-gray-500 py-12">
            Cargando libros...
          </div>
        )}

        {!isLoading && (
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
                  className="border border-gray-600 rounded-lg px-6 py-2 text-white hover:bg-red-900/20 hover:border-red-500 transition-colors disabled:opacity-50"
                >
                  {deletingId === book._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje cuando no hay libros */}
        {!isLoading && books.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No hay libros agregados
          </div>
        )}
      </div>
    </div>
  );
}

export default BooksPage;
