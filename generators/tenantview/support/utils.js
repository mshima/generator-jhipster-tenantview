import { get } from 'lodash-es';
import { parse } from 'node-html-parser';

/**
 *
 * @param {HTMLElement | string} root
 * @param {string} query
 * @param  {string} propertyPath
 */
export const getNode = (root, query, propertyPath) => {
  if (typeof root === 'string') {
    root = parse(root);
  }
  const selected = root.querySelector(query);
  if (!selected) {
    throw new Error(`Could not find node with query: ${query}`);
  }
  if (propertyPath) {
    const value = get(selected, propertyPath);
    if (!value) {
      throw new Error(`Could not find path with query: ${propertyPath}`);
    }
    return value;
  }
  return selected;
};
