import render from 'src/test/render';
import { Home } from '../App';

test('renders', () => {
  expect(true).toBe(true);
  expect(() => render(<Home />)).not.toThrow();
});
