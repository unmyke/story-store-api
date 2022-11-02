export const methods = [
  {
    method: 'GET',
    toHandlerRequest: ({ params, query }) => ({ params, query }),
  },
  {
    method: 'POST',
    toHandlerRequest: ({ params, body }) => ({ params, body }),
  },
  {
    method: 'PUT',
    toHandlerRequest: ({ params, body }) => ({ params, body }),
  },
  {
    method: 'PATCH',
    toHandlerRequest: ({ params, body }) => ({ params, body }),
  },
  {
    method: 'DELETE',
    toHandlerRequest: ({ params }) => ({ params }),
  },
];
