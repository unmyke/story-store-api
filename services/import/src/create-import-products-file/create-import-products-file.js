export const createImportProductsFile =
  ({ uploadStore }) =>
  async ({ query: { name: fileName } }) => {
    const signedUrl = await uploadStore.getSignedUrl(fileName);
    return { statusCode: 200, body: signedUrl };
  };
