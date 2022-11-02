import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Job } from '../types';
import { BASE_URL } from './config';

export const schedulerApi = createApi({
  reducerPath: 'schedulerApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Job'],
  endpoints: (builder) => ({
    getJobs: builder.query<Job[], void>({
      query: () => `schedules`,
      providesTags: ['Job'],
    }),
    addJob: builder.mutation<Job, Omit<Job, 'jobId'>>({
      query: (body) => ({
        url: `schedules`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Job'],
    }),
    deleteJob: builder.mutation<void, string>({
      query: (jobId) => ({
        url: `schedules/${jobId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),
  }),
});

export const { useGetJobsQuery, useAddJobMutation, useDeleteJobMutation } =
  schedulerApi;
