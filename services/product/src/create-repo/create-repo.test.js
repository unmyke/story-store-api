import { createRepo } from './create-repo';

describe('# @services/prodcut::createRepo', () => {
  it('should return repo with methods', () => {
    const db = {};
    const repo = createRepo({ db });
    expect(repo).toStrictEqual({
      getProduct: expect.any(Function),
      getProducts: expect.any(Function),
    });
  });
});
