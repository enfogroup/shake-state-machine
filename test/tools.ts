/* eslint-disable @typescript-eslint/no-explicit-any */

export const checkAllMocksCalled = (mocks: jest.SpyInstance[], times: number) => {
  mocks.forEach((mock: jest.SpyInstance) => {
    expect(mock).toHaveBeenCalledTimes(times)
  })
}
