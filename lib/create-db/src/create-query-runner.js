export const createQueryRunner = (createClient) => {
  const query = async (query, values) => {
    const { connect, disconnect, atomicQuery } = createClient();
    await connect();
    try {
      const result = await atomicQuery(query, values);
      return result;
    } finally {
      await disconnect();
    }
  };

  const transaction = async (queryCallback) => {
    const { connect, disconnect, atomicQuery, transaction } = createClient();
    await connect();
    try {
      await transaction.begin();
      const result = await queryCallback(atomicQuery);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      await disconnect();
    }
  };

  return { query, transaction };
};
