import { AppPage } from './app.po';

describe('webtv App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
  it('always fails', () => {
    expect(0).toBe(1);
  });
});