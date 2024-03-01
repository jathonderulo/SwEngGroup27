// Import necessary dependencies for testing
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import InputOutputBox from './InputOutputBox';

// Mock axios module
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { threadID: 'mockThreadID' } })),
}));

// Test suite for InputOutputBox component
describe('InputOutputBox component', () => {
  // Test case: Renders InputOutputBox component
  it('should render InputOutputBox component', async () => {
    // Render InputOutputBox component
    const { getByText } = render(<InputOutputBox />);

    // Assert that the component renders successfully
    expect(getByText('Chat Window')).toBeInTheDocument();
    expect(getByText('AI Avatar')).toBeInTheDocument();
    expect(getByText('Chat Input')).toBeInTheDocument();
  });

  // Test case: Handles message submission
  it('should handle message submission', async () => {
    // Render InputOutputBox component
    const { getByText, getByLabelText } = render(<InputOutputBox />);

    // Simulate user input and submit message
    fireEvent.change(getByLabelText('Enter your message:'), { target: { value: 'Test message' } });
    fireEvent.click(getByText('Send'));

    // Wait for the message to be sent
    await waitFor(() => {
      // Assert that the loading indicator is displayed
      expect(getByText('Loading...')).toBeInTheDocument();

      // Assert that the message is added to the chat window
      expect(getByText('Test message')).toBeInTheDocument();

      // Assert that the AI response is added to the chat window
      expect(getByText('AI response')).toBeInTheDocument();
    });
  });
});
