/**
 * Remove undefined values before sending plain application data to Firestore.
 * Firestore rejects undefined at any nesting level unless ignoreUndefinedProperties
 * is enabled. Keep array positions stable by converting undefined array entries to null.
 */
export function sanitizeFirestoreValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) =>
      item === undefined ? null : sanitizeFirestoreValue(item)
    ) as T;
  }

  if (value && typeof value === "object") {
    const prototype = Object.getPrototypeOf(value);
    // Only rebuild plain objects. Preserve SDK values such as Timestamp, Date,
    // DocumentReference, and other class instances unchanged.
    if (prototype === Object.prototype || prototype === null) {
      const sanitized: Record<string, unknown> = {};
      for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
        if (nested !== undefined) {
          sanitized[key] = sanitizeFirestoreValue(nested);
        }
      }
      return sanitized as T;
    }
  }

  return value;
}
