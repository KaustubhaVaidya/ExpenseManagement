import React from 'react';
import { 
  Clock, 
  Loader, 
  CheckCircle, 
  XCircle, 
  FileText, 
  AlertTriangle,
  Zap,
  Database
} from 'lucide-react';
import { Expense } from '../../types/expense';
import { format } from 'date-fns';

interface ProcessingStatusProps {
  expenses: Expense[];
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ expenses }) => {
  const processingExpenses = expenses.filter(e => 
    e.attachments.length > 0 || e.processingStatus
  );

  const getProcessingIcon = (status?: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-gray-500" />;
      case 'extracting': return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getProcessingColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'extracting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusCounts = processingExpenses.reduce((acc, expense) => {
    const status = expense.processingStatus || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">ABBYY Processing Status</h2>
        <p className="text-gray-600 mt-1">Monitor document processing and data extraction</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.extracting || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.completed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.failed || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Queue */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Database className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Processing Queue</h3>
          </div>
        </div>

        {processingExpenses.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents processing</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload expense receipts to see ABBYY processing status here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expense
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent to ABBYY
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processingExpenses.map((expense) => (
                  expense.attachments.map((attachment) => (
                    <tr key={`${expense.id}-${attachment.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {expense.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              #{expense.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{attachment.name}</div>
                        <div className="text-sm text-gray-500">{attachment.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getProcessingColor(expense.processingStatus)}`}
                        >
                          {getProcessingIcon(expense.processingStatus)}
                          <span className="ml-1 capitalize">
                            {expense.processingStatus || 'Unknown'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attachment.abbyySentAt 
                          ? format(new Date(attachment.abbyySentAt), 'MMM dd, HH:mm')
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {attachment.abbyyProcessedAt 
                          ? format(new Date(attachment.abbyyProcessedAt), 'MMM dd, HH:mm')
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.extractedData?.confidence 
                          ? `${(expense.extractedData.confidence * 100).toFixed(1)}%`
                          : '-'
                        }
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Integration Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">ABBYY Vantage Integration</h3>
            <p className="text-blue-800 mt-2">
              Uploaded receipts and invoices are automatically sent to ABBYY Vantage for data extraction. 
              The system extracts key information like vendor names, amounts, dates, and invoice numbers 
              to pre-populate expense fields and improve accuracy.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="text-sm font-medium text-blue-900">Average Processing Time</p>
                <p className="text-xl font-bold text-blue-600">2-5 seconds</p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="text-sm font-medium text-blue-900">Extraction Accuracy</p>
                <p className="text-xl font-bold text-blue-600">95%+</p>
              </div>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="text-sm font-medium text-blue-900">Supported Formats</p>
                <p className="text-xl font-bold text-blue-600">PDF, JPG, PNG</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};