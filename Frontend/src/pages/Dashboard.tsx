
import React, { useState } from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import { useIsMobile } from '../hooks/use-mobile';
import DashboardLayout from '../components/layout/DashboardLayout';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeCard from '../components/employees/EmployeeCard';
import EmployeeListHeader from '../components/employees/EmployeeListHeader';
import EmployeePagination from '../components/employees/EmployeePagination';
import PaginationInfo from '../components/employees/PaginationInfo';

const Dashboard: React.FC = () => {
  const { employees, deleteEmployee } = useEmployees();
  const isMobile = useIsMobile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of employees per page
  
  const filteredEmployees = employees?.filter(
    (employee) =>
      employee.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchQuery.toLowerCase())||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate pagination values
  const totalItems = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleDelete = (id: string) => {
    // In a real app, you might want to show a confirmation dialog
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
    }
  };
  
  return (
    <DashboardLayout title="Employees">
      <EmployeeListHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {currentEmployees.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No employees found matching your search.</p>
            </div>
          ) : (
            currentEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <EmployeeTable
            employees={currentEmployees}
            onDelete={handleDelete}
          />
        </div>
      )}
      
      <div className="mt-5 flex flex-col gap-2 items-center">
        {filteredEmployees.length > 0 && (
          <EmployeePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <PaginationInfo
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
