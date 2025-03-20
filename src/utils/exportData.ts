import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ExportData {
  [key: string]: any;
}

interface TableRow {
  [key: string]: string | number;
}

export const exportToCSV = (data: ExportData[], filename: string) => {
  // Convert data to CSV format
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row: TableRow) => headers.map(header => row[header]).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: ExportData[], filename: string, title: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);

  // Convert data to table format
  const headers = Object.keys(data[0]);
  const tableData = data.map((row: TableRow) => headers.map(header => row[header]));

  // Add table
  (doc as any).autoTable({
    head: [headers],
    body: tableData,
    startY: 20,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
  });

  // Save PDF
  doc.save(`${filename}.pdf`);
};

export const prepareDataForExport = (type: string, data: any): ExportData[] => {
  switch (type) {
    case 'rating':
      return [
        {
          'Review ID': 'REV-001',
          'User ID': 'USR-001',
          'Rating': '4.5',
          'Sentiment': 'Positive',
          'Source': 'Mobile App',
          'Product': 'Sample Product 1',
          'Category': 'Electronics',
          'Quantity': '1',
          'Review Date': '2024-03-15'
        },
        // Add more sample data as needed
      ];

    case 'sentiment':
      return [
        {
          'Date': '2024-03-15',
          'Overall Sentiment': '65%',
          'Tone': 'Friendly',
          'Emotion Score': '82%',
          'User Group': 'New Users',
          'Source': 'Mobile App'
        },
        // Add more sample data as needed
      ];

    case 'userInsights':
      return [
        {
          'Metric': 'Total Users',
          'Value': '12,345',
          'Change': '+5.2%',
          'Period': 'Last 30 days'
        },
        {
          'Metric': 'Active Users',
          'Value': '8,765',
          'Change': '+3.8%',
          'Period': 'Last 30 days'
        },
        // Add more sample data as needed
      ];

    case 'category':
      return [
        {
          'Product ID': 'PRD-001',
          'Name': 'Sample Product 1',
          'Category': 'Electronics',
          'Price': '$99.99',
          'Units Sold': '150',
          'Revenue': '$14,998.50'
        },
        // Add more sample data as needed
      ];

    default:
      return [];
  }
}; 