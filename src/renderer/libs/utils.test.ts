import { capitalizaFirstLetter } from './utils';

describe('Utils', () => {
  it('capitalizeFirstLetter should capitalize the first letter of any string passed', () => {
    expect(capitalizaFirstLetter('expect')).toBe('Expect');
  });
});
