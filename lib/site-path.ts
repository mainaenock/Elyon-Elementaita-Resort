export function sitePath(path: `/${string}`) {
  return `${process.env.NEXT_PUBLIC_ELYON_BASE_PATH ?? ""}${path}`;
}
