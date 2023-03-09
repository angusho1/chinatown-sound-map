import App from './App';
import { customRender } from 'utils/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { screen } from '@testing-library/react';
import { MsalReactTester } from 'msal-react-tester';

let msalTester: MsalReactTester;

// Mock requests
const server = setupServer(
);

// establish API mocking before all tests
beforeAll(() => server.listen())

beforeEach(() => msalTester = new MsalReactTester())

// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())
// clean up once the tests are done
afterAll(() => server.close())

test('Renders title', () => {
  msalTester.isNotLogged();
  const { getByText } = customRender(<App instance={msalTester.client} />);

  expect(getByText('Chinatown Sound Map')).toBeInTheDocument();
  expect(document.title).toEqual('Chinatown Sound Map');
});

test('Routes to About Page', async () => {
  msalTester.isNotLogged();
  customRender(<App instance={msalTester.client} />, { route: '/about '});
  expect(document.title).toEqual('About');
});

test('Navigates to pages using menu', async () => {
  msalTester.isNotLogged();
  const { user } = customRender(<App instance={msalTester.client} />);

  await user.click(screen.getByRole('link', { name: /about/i }));
  expect(document.title).toEqual('About');

  await user.click(screen.getByRole('link', { name: /contribute/i }));
  expect(document.title).toEqual('Contribute');

  await user.click(screen.getByRole('link', { name: /contact/i }));
  expect(document.title).toEqual('Contact');
});

test('Navigates to home page using header', async () => {
  msalTester.isNotLogged();
  const { user, queryByTestId } = customRender(<App instance={msalTester.client} />, { route: '/about '});

  await user.click(screen.getByRole('link', { name: /chinatown-sound-map/i }));
  expect(document.title).toEqual('Chinatown Sound Map');
  expect(queryByTestId('sound-map')).toBeInTheDocument();
});