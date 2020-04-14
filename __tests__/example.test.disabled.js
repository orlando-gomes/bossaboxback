function soma(a, b) {
  return a + b;
}

test('Calling soma(4, 5) should result 9', () => {
  const result = soma(4, 5);

  expect(result).toBe(9);
});
