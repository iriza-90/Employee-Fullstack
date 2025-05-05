
import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import EmployeeForm from '../components/employees/EmployeeForm';

const AddEmployee: React.FC = () => {
  return (
    <DashboardLayout title="Add Employee">
      <div className="max-w-3xl mx-auto">
        <EmployeeForm />
      </div>
    </DashboardLayout>
  );
};

export default AddEmployee;
