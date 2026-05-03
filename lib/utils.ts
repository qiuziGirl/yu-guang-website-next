/**
 * 将下划线命名转换为驼峰命名
 */
export function toCamelCase<T>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = (obj as Record<string, unknown>)[key];
    }
  }
  return result as T;
}