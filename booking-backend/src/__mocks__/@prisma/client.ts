// __mocks__/@prisma/client.ts
export const mockFindUnique = jest.fn();
export const mockCreate = jest.fn();

export const PrismaClient = jest.fn().mockImplementation(() => ({
  user: {
    findUnique: mockFindUnique,
    create: mockCreate,
  },
}));
