import App from './App';
import { customRender } from 'utils/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { soundClipMock1 } from 'mocks/soundClips.mock';
import { screen } from '@testing-library/react';

// Mock requests
const server = setupServer(
  rest.get('/sound-clips', (req, res, ctx) => {
    return res(ctx.json([ soundClipMock1 ]));
  }),
);

// establish API mocking before all tests
beforeAll(() => server.listen())
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())
// clean up once the tests are done
afterAll(() => server.close())

test('Renders title', () => {
  const { getByText } = customRender(<App />);

  expect(getByText('Chinatown Sound Map')).toBeInTheDocument();
  expect(document.title).toEqual('Chinatown Sound Map');
});

test('Routes to About Page', async () => {
  customRender(<App />, { route: '/about '});
  expect(document.title).toEqual('About');
});

test('Navigates to pages using menu', async () => {
  const { user } = customRender(<App />);

  await user.click(screen.getByRole('link', { name: /about/i }));
  expect(document.title).toEqual('About');

  await user.click(screen.getByRole('link', { name: /contribute/i }));
  expect(document.title).toEqual('Contribute');

  await user.click(screen.getByRole('link', { name: /contact/i }));
  expect(document.title).toEqual('Contact');
});

test('Navigates to home page using header', async () => {
  const { user, queryByTestId } = customRender(<App />, { route: '/about '});

  await user.click(screen.getByRole('link', { name: /chinatown-sound-map/i }));
  expect(document.title).toEqual('Chinatown Sound Map');
  expect(queryByTestId('sound-map')).toBeInTheDocument();
});