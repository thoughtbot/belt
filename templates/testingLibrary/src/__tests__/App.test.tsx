import render from 'src/test/render';
import App from '../../App';

test('renders', () => {
  expect(true).toBe(true);
  expect(() => render(<App />)).not.toThrow();
});
