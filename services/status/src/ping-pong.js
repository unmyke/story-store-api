export const pingPong = async (request) => {
  console.log(request);
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  };
};
