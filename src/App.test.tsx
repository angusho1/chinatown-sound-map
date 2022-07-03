import App from './App';
import { renderWithProviders } from 'utils/test-utils';

test('Renders title', () => {
  const { getByText } = renderWithProviders(
    <App />
  );

  expect(getByText('Chinatown Sound Map')).toBeInTheDocument();
});
