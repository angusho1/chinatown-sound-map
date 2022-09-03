import App from './App';
import { customRender } from 'utils/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { soundClipMock1 } from 'mocks/soundClips.mock';

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