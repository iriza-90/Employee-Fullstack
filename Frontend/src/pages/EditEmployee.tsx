
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import EmployeeForm from '../components/employees/EmployeeForm';
import { useEmployees } from '../contexts/EmployeeContext';

const EditEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEmployee } = useEmployees();
  
  // Get employee from context
  const employee = id ? getEmployee(id) : undefined;
  
  // If employee not found, redirect to dashboard
  if (!employee) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <DashboardLayout title="Edit Employee">
      <div className="max-w-3xl mx-auto">
        <EmployeeForm employee={employee} isEdit />
      </div>
    </DashboardLayout>
  );
};

export default EditEmployee;
