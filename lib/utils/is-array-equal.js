const { isArray } = Array;


export default function isAarryEqual(a1, a2) {
  if (!(isArray(a1) && isArray(a2))) {
    return false;
  }

  return a1.every(function(value, index) {
    return value === a2[index];
  });
}
