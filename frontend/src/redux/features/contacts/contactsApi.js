import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

export const contactsApi = createApi({
  reducerPath: "contactsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/contacts`,
    credentials: "include",
  }),
  tagTypes: ["Contacts"],
  endpoints: (builder) => ({
    submitContact: builder.mutation({
      query: (contactData) => ({
        url: "/",
        method: "POST",
        body: contactData,
      }),
      invalidatesTags: ["Contacts"],
    }),
    fetchAllContacts: builder.query({
      query: () => "/",
      providesTags: ["Contacts"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contacts"],
    }),
  }),
});

export const {
  useSubmitContactMutation,
  useFetchAllContactsQuery,
  useDeleteContactMutation,
} = contactsApi;

export default contactsApi;
