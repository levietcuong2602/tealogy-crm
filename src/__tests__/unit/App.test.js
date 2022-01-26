import React from 'react';
import { shallow } from 'enzyme';

describe('App component', () => {
  it('show the comment box component', () => {
    // Arrange
    const wrapped = shallow(<div />);
    // Actions
    // Assert
    // Unmount
    wrapped.unmount;
  });
});
