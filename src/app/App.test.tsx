import App from './App';
import { customRender } from 'utils/test-utils';

test('Renders title', () => {
  const { getByText } = customRender(<App />);

  expect(getByText('Chinatown Sound Map')).toBeInTheDocument();
  expect(document.title).toEqual('Chinatown Sound Map');
});

test('Routes to About Page', async () => {
  const { getByText } = customRender(<App />, { route: '/about '});

  expect(getByText(/About Page/i)).toBeInTheDocument();
});

test('Navigates to pages using menu', async () => {
  const { user, getByText } = customRender(<App />);

  await user.click(getByText(/About/i));
  expect(document.title).toEqual('About');
  expect(getByText(/About Page/i)).toBeInTheDocument();

  await user.click(getByText(/Contribute/i));
  expect(document.title).toEqual('Contribute');
  expect(getByText(/Contribute Page/i)).toBeInTheDocument();

  await user.click(getByText(/Contact/i));
  expect(document.title).toEqual('Contact');
  expect(getByText(/Contact Page/i)).toBeInTheDocument();
});

test('Navigates to home page using header', async () => {
  const { user, getByText, queryByTestId } = customRender(<App />, { route: '/about '});

  await user.click(getByText(/Chinatown Sound Map/i));
  expect(document.title).toEqual('Chinatown Sound Map');
  expect(queryByTestId('sound-map')).toBeInTheDocument();
});