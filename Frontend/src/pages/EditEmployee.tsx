import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import EmployeeForm from '../components/employees/EmployeeForm';
import {fetchData} from "@/utils/helpers.tsx";
import {Employee} from "@/contexts/EmployeeContext.tsx";
import {servers} from "@/utils/api.tsx";


const EditEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadEmployee = async () => {
      const token = localStorage.getItem('authToken'); // Adjust if you store it elsewhere
      if (!token || !id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const { data, error } = await fetchData(`${servers.server1}/employees/${id}`, token);

      if (error || data === -1) {
        setNotFound(true);
      } else {
        setEmployee(data);
      }

      setLoading(false);
    };

    loadEmployee();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (notFound || !employee) return <Navigate to="/dashboard" replace />;

  return (
      <DashboardLayout title="Edit Employee">
        <div className="max-w-3xl mx-auto">
          <EmployeeForm employee={employee} isEdit />
        </div>
      </DashboardLayout>
  );
};

export default EditEmployee;
