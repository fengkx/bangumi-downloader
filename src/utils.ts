export function arrayEqualIgnoredOrder(left: unknown[], right: unknown[]) {
  return left.length === right.length &&
    left.every((item) => right.includes(item));
}
