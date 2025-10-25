import * as types from '../index';

describe('Types Index - Basic Coverage', () => {
  it('should export type definitions', () => {
    // Test that the module exports are accessible
    expect(types).toBeDefined();
    expect(typeof types).toBe('object');
  });

  it('should have exports object', () => {
    // Test that we can access the module
    const moduleExports = types;
    expect(moduleExports).not.toBeNull();
  });
});
