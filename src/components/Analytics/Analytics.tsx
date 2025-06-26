import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Clock,
  PieChart,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react';
import { Expense } from '../../types/expense';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface AnalyticsProps {
  expenses: Expense[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ expenses }) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const currentMonth = startOfMonth(now);
    const lastMonth = startOfMonth(subMonths(now, 1));
    
    // Current month expenses
    const currentMonthExpenses = expenses.filter(e => 
      new Date(e.date) >= currentMonth && e.status !== 'rejected'
    );
    
    // Last month expenses
    const lastMonthExpenses = expenses.filter(e => 
      new Date(e.date) >= lastMonth && 
      new Date(e.date) < currentMonth && 
      e.status !== 'rejected'
    );

    // Totals
    const totalAmount = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const lastMonthAmount = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalCount = currentMonthExpenses.length;
    const pendingCount = expenses.filter(e => e.status === 'submitted').length;
    const processingCount = expenses.filter(e => e.processingStatus === 'extracting').length;

    // Growth calculation
    const growth = lastMonthAmount > 0 
      ? ((totalAmount - lastMonthAmount) / lastMonthAmount) * 100 
      : 0;

    // Category breakdown
    const categoryTotals = expenses
      .filter(e => e.status !== 'rejected')
      .reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

    // Status breakdown
    const statusCounts = expenses.reduce((acc, expense) => {
      acc[expense.status] = (acc[expense.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Monthly trend (last 6 months)
    const monthlyTrend = eachMonthOfInterval({
      start: subMonths(now, 5),
      end: now
    }).map(month => {
      const monthExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= startOfMonth(month) && 
               expenseDate <= endOfMonth(month) && 
               e.status !== 'rejected';
      });
      
      return {
        month: format(month, 'MMM yyyy'),
        amount: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
        count: monthExpenses.length
      };
    });

    return {
      totalAmount,
      totalCount,
      pendingCount,
      processingCount,
      growth,
      categoryTotals,
      statusCounts,
      monthlyTrend
    };
  }, [expenses]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    change?: number;
    changeLabel?: string;
    color: string;
  }> = ({ title, value, icon: Icon, change, changeLabel, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}% {changeLabel}
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600 mt-1">Overview of expense data and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total This Month"
          value={`$${analytics.totalAmount.toFixed(2)}`}
          icon={DollarSign}
          change={analytics.growth}
          changeLabel="from last month"
          color="bg-blue-600"
        />
        <StatCard
          title="Total Expenses"
          value={analytics.totalCount}
          icon={FileText}
          color="bg-green-600"
        />
        <StatCard
          title="Pending Approval"
          value={analytics.pendingCount}
          icon={Clock}
          color="bg-yellow-600"
        />
        <StatCard
          title="Processing"
          value={analytics.processingCount}
          icon={BarChart3}
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trend</h3>
            <TrendingUp className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {analytics.monthlyTrend.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">{month.month}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    ${month.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{month.count} expenses</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
            <PieChart className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {Object.entries(analytics.categoryTotals)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([category, amount], index) => {
                const colors = [
                  'bg-blue-500',
                  'bg-green-500', 
                  'bg-yellow-500',
                  'bg-purple-500',
                  'bg-pink-500',
                  'bg-indigo-500'
                ];
                const percentage = (amount / Object.values(analytics.categoryTotals).reduce((a, b) => a + b, 0)) * 100;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${colors[index]} rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Status Overview</h3>
          <BarChart3 className="h-5 w-5 text-gray-500" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(analytics.statusCounts).map(([status, count]) => {
            const statusColors = {
              draft: 'bg-gray-100 text-gray-800',
              submitted: 'bg-blue-100 text-blue-800',
              processing: 'bg-yellow-100 text-yellow-800',
              approved: 'bg-green-100 text-green-800',
              rejected: 'bg-red-100 text-red-800',
              paid: 'bg-green-100 text-green-900'
            };
            
            return (
              <div key={status} className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}>
                  {count}
                </div>
                <p className="text-xs text-gray-600 mt-2 capitalize">{status}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};