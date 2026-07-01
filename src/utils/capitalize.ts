type NameWithDash = `${string}-${string}`;
type NameWithSpace = `${string} ${string}`;
function isNameWithDash(value: string): value is NameWithDash {
  return /^[^-]+-[^-]+$/.test(value);
}
function isNameWithSpace(value: string): value is NameWithSpace {
  return /^[^ ]+ [^ ]+$/.test(value);
}

export function capitalize(
  make: string | NameWithDash | NameWithSpace,
): string {
  if (isNameWithSpace(make)) {
    const firstWord =
      make.split(" ")[0].charAt(0).toUpperCase() +
      make.split(" ")[0].substring(1).toLowerCase();
    const secondWord =
      make.split(" ")[1].charAt(0).toUpperCase() +
      make.split(" ")[1].substring(1).toLowerCase();
    return `${firstWord}-${secondWord}`;
  } else if (isNameWithDash(make)) {
    const firstWord =
      make.split("-")[0].charAt(0).toUpperCase() +
      make.split("-")[0].substring(1).toLowerCase();

    const secondWord =
      make.split("-")[1].charAt(0).toUpperCase() +
      make.split("-")[1].substring(1).toLowerCase();
    return `${firstWord}-${secondWord}`;
  } else {
    return make.charAt(0).toUpperCase() + make.substring(1).toLowerCase();
  }
}
