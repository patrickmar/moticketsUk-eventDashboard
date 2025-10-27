import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  endpoints: (builder) => ({
    getTodos: builder.query<any[], void>({
      query: () => "/todos",
    }),
    getTodoById: builder.query<any, number>({
      query: (id) => `/todos/${id}`,
    }),
  }),
});

export const { useGetTodosQuery, useGetTodoByIdQuery } = apiSlice;
