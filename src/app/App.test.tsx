import App from './App';
import { customRender } from 'utils/test-utils';
import { screen} from '@testing-library/react';

test('Renders title', () => {
  const { user } = customRender(<App />);

  expect(screen.getByText('Chinatown Sound Map')).toBeInTheDocument();
});
