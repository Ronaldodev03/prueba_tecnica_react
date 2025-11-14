import api from "../config/axios";

export const getBooks = async () => {
  const { data } = await api.get("/books");
  return data;
};

export const createBook = async (bookData) => {
  const { data } = await api.post("/books", bookData);
  return data;
};

export const deleteBook = async (id) => {
  const { data } = await api.delete(`/books/${id}`);
  return data;
};
