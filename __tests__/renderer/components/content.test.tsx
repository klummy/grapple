import React from 'react';
import { cleanup, render } from 'react-testing-library';

import { Content } from '@/renderer/components/Content/Content';
import MockStore from '../../helpers/mock-store';

describe('<Content />', () => {
  afterEach(cleanup);

  test('that the content isn\'t rendered if there is no active tab', () => {
    const { queryByTestId } = render(
      <Content
        activeTab="tab"
        notifications={[]}
        tabs={[]}
      />,
    );

    expect(queryByTestId('queryPane')).toBeNull();
    expect(queryByTestId('results')).toBeNull();
  });

  test('that the empty state renders when there is no active tab', () => {
    const { queryByTestId } = render(
      <Content
        activeTab="tab"
        notifications={[]}
        tabs={[]}
      />,
    );

    expect(queryByTestId('emptyState')).toBeTruthy();
  });

  test('that the queryPane & results components render if there is an active tab', () => {
    const tabID = 'tab';

    const { queryByTestId } = render(
      <MockStore>
        <Content
          activeTab={tabID}
          notifications={[]}
          tabs={[
            {
              id: tabID,
            },
          ]}
        />
      </MockStore>,
    );

    expect(queryByTestId('queryPane')).toBeTruthy();
    expect(queryByTestId('results')).toBeTruthy();
  });
});
