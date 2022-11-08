export const Methods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const ParsersByMethod = {
  [Methods.GET]: ({ params, query }) => ({ params, query }),
  [Methods.POST]: ({ params, body }) => ({ params, body }),
  [Methods.PUT]: ({ params, body }) => ({ params, body }),
  [Methods.PATCH]: ({ params, body }) => ({ params, body }),
  [Methods.DELETE]: ({ params }) => ({ params }),
};
