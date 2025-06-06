import React from 'react';
import { render, screen } from '@testing-library/react';
import ExcelUpload from '../ExcelUpload';

describe('ExcelUpload Component', () => {
  test('renders upload button and file input', () => {
    render(<ExcelUpload onUploadSuccess={() => {}} />);
    expect(screen.getByText(/Upload Excel File/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox') || screen.getByRole('input') || screen.getByLabelText(/upload excel file/i)).toBeTruthy();
  });

  test('does not show AI insights or summary', () => {
    render(<ExcelUpload onUploadSuccess={() => {}} />);
    expect(screen.queryByText(/AI Insights/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Summary/i)).not.toBeInTheDocument();
  });
});
