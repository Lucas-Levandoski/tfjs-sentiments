export function dotProduct(a: number[], b: number[]): number {
  if(a.length !== b.length) return -1;

  let product = 0;

  for(let i = 0; i < a.length; i++) {
    product += a[i]*b[i];
  }

  return product;
}


export function cosineSimilarity(a: number[], b: number[]): number {
  const aMag = Math.sqrt(a.reduce((acc, value) => (acc += value**2), 0));
  const bMag = Math.sqrt(b.reduce((acc, value) => (acc += value**2), 0));

  const dot = dotProduct(a, b);

  return dot / (aMag * bMag);
}



