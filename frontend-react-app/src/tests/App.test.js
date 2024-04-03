import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import InputOutputBox from './InputOutputBox';

describe('InputOutputBox component', () => {
  it('renders without crashing', () => {
    render(<InputOutputBox />);
  });

  it('handles message submission', async () => {
    // Mock fetch function
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'AI response' }),
    });

    const { getByLabelText, getByText } = render(<InputOutputBox />);

    fireEvent.change(getByLabelText('Enter your message:'), {
      target: { value: 'Test message' },
    });
    fireEvent.click(getByText('Send'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(fetch.mock.calls[0][0]).toBe('http://localhost:3001/chat');
      expect(fetch.mock.calls[0][1].method).toBe('POST');

      expect(getByText('Test message')).toBeInTheDocument();
      expect(getByText('AI response')).toBeInTheDocument();
    });
  });

  // Add more test cases as needed
});
