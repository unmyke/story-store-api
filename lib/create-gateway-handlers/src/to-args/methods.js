export const methods = [
  {
    method: 'GET',
    toArgs: ({ params, query }) => ({ ...params, filter: query }),
  },
  {
    method: 'POST',
    toArgs: ({ params, body }) => ({ ...params, payload: body }),
  },
  {
    method: 'PUT',
    toArgs: ({ params, body }) => ({ ...params, payload: body }),
  },
  {
    method: 'PATCH',
    toArgs: ({ params, body }) => ({ ...params, payload: body }),
  },
  {
    method: 'DELETE',
    toArgs: ({ params }) => params,
  },
];
