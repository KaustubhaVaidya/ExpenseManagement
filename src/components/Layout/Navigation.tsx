import React from 'react';
import { 
  Plus, 
  List, 
  CheckCircle, 
  BarChart3, 
  FileText,
  Clock
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'employee' | 'manager' | 'admin';
  pendingApprovals?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  userRole,
  pendingApprovals = 0
}) => {
  const navigationItems = [
    {
      id: 'create',
      label: 'Create Expense',
      icon: Plus,
      roles: ['employee', 'manager', 'admin']
    },
    {
      id: 'expenses',
      label: 'My Expenses',
      icon: List,
      roles: ['employee', 'manager', 'admin']
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: CheckCircle,
      roles: ['manager', 'admin'],
      badge: pendingApprovals > 0 ? pendingApprovals : undefined
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      roles: ['manager', 'admin']
    },
    {
      id: 'processing',
      label: 'Processing Status',
      icon: Clock,
      roles: ['employee', 'manager', 'admin']
    }
  ];

  const visibleItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  transition-colors relative
                  ${isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};