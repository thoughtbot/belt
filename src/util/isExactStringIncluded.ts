export default async function isExactStringIncluded(string: string, match: string) {
  const escapeRegExpMatch = function (s: string) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  };
  return new RegExp(`\\b${escapeRegExpMatch(match)}\\b`).test(string);
}
