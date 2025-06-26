import React, { useState } from 'react';
import {
  X,
  FileText,
  Calendar,
  DollarSign,
  User,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  AlertCircle,
  Loader
} from 'lucide-react';
import { Expense } from '../../types/expense';
import { format } from 'date-fns';

interface ExpenseDetailProps {
  expense: Expense;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  userRole: 'employee' | 'manager' | 'admin';
  canApprove?: boolean;
}

export const ExpenseDetail: React.FC<ExpenseDetailProps> = ({
  expense,
  onClose,
  onApprove,
  onReject,
  userRole,
  canApprove = false
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!onApprove) return;
    setLoading(true);
    try {
      await onApprove(expense.id);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!onReject || !rejectionReason.trim()) return;
    setLoading(true);
    try {
      await onReject(expense.id, rejectionReason);
      setShowRejectForm(false);
      setRejectionReason('');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'submitted': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'processing': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'paid': return <DollarSign className="h-5 w-5 text-green-600" />;
      default: return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-900 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getStatusIcon(expense.status)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{expense.title}</h2>
              <p className="text-sm text-gray-500">Expense #{expense.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(expense.status)}`}
            >
              {getStatusIcon(expense.status)}
              <span className="ml-1 capitalize">{expense.status}</span>
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-semibold text-gray-900">
                  {expense.currency} {expense.amount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-lg font-semibold text-gray-900">{expense.category}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <User className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted By</p>
                <p className="text-lg font-semibold text-gray-900">{expense.submittedBy}</p>
              </div>
            </div>

            {expense.submittedAt && (
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {format(new Date(expense.submittedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {expense.description && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{expense.description}</p>
            </div>
          )}

          {/* Extracted Data */}
          {expense.extractedData && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Extracted Data (ABBYY Vantage)</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expense.extractedData.vendor && (
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Vendor</p>
                      <p className="text-gray-900">{expense.extractedData.vendor}</p>
                    </div>
                  )}
                  {expense.extractedData.invoiceNumber && (
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Invoice Number</p>
                      <p className="text-gray-900">{expense.extractedData.invoiceNumber}</p>
                    </div>
                  )}
                  {expense.extractedData.confidence && (
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Confidence Score</p>
                      <p className="text-gray-900">{(expense.extractedData.confidence * 100).toFixed(1)}%</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Extracted At</p>
                    <p className="text-gray-900">
                      {format(new Date(expense.extractedData.extractedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing Status */}
          {expense.processingStatus && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Status</h3>
              <div className="flex items-center space-x-2">
                {expense.processingStatus === 'extracting' && (
                  <Loader className="h-4 w-4 animate-spin text-blue-500" />
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  expense.processingStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  expense.processingStatus === 'extracting' ? 'bg-blue-100 text-blue-800' :
                  expense.processingStatus === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {expense.processingStatus.charAt(0).toUpperCase() + expense.processingStatus.slice(1)}
                </span>
              </div>
            </div>
          )}

          {/* Attachments */}
          {expense.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Attachments</h3>
              <div className="space-y-3">
                {expense.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{attachment.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(attachment.size)} • 
                          Uploaded {format(new Date(attachment.uploadedAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                        {attachment.abbyySentAt && (
                          <p className="text-xs text-blue-600">
                            Sent to ABBYY {format(new Date(attachment.abbyySentAt), 'MMM dd, HH:mm')}
                            {attachment.abbyyProcessedAt && 
                              ` • Processed ${format(new Date(attachment.abbyyProcessedAt), 'MMM dd, HH:mm')}`
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approval History */}
          {(expense.approvedAt || expense.rejectedAt) && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Approval History</h3>
              <div className="space-y-3">
                {expense.approvedAt && (
                  <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-900">
                        Approved by {expense.approvedBy}
                      </p>
                      <p className="text-sm text-green-700">
                        {format(new Date(expense.approvedAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                )}
                {expense.rejectedAt && (
                  <div className="flex items-start space-x-3 bg-red-50 p-4 rounded-lg">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">
                        Rejected by {expense.rejectedBy}
                      </p>
                      <p className="text-sm text-red-700">
                        {format(new Date(expense.rejectedAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                      {expense.rejectionReason && (
                        <p className="text-sm text-red-800 mt-2 bg-red-100 p-2 rounded">
                          <strong>Reason:</strong> {expense.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {canApprove && expense.status === 'submitted' && (
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              {!showRejectForm ? (
                <>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={loading}
                    className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    <span>Approve</span>
                  </button>
                </>
              ) : (
                <div className="w-full">
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-3 mt-3">
                    <button
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectionReason('');
                      }}
                      disabled={loading}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={loading || !rejectionReason.trim()}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      {loading ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>Reject Expense</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};