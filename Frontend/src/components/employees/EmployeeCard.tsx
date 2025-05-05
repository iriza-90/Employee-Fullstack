
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee } from '../../contexts/EmployeeContext';
import { Button } from '../ui/form-elements';

interface EmployeeCardProps {
  employee: Employee;
  onDelete: (id: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onDelete }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
          <p className="text-sm text-gray-500">{employee.position}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {employee.department}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="text-sm flex items-center">
          <span className="font-medium mr-2">Email:</span>
          <span className="text-gray-600">{employee.email}</span>
        </p>
        
        {employee.phone && (
          <p className="text-sm flex items-center">
            <span className="font-medium mr-2">Phone:</span>
            <span className="text-gray-600">{employee.phone}</span>
          </p>
        )}
        
        <p className="text-sm flex items-center">
          <span className="font-medium mr-2">Join Date:</span>
          <span className="text-gray-600">
            {new Date(employee.joinDate).toLocaleDateString()}
          </span>
        </p>
      </div>
      
      <div className="mt-5 flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/employees/edit/${employee.id}`)}
        >
          Edit
        </Button>
        <Button 
          variant="danger" 
          size="sm"
          onClick={() => onDelete(employee.id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default EmployeeCard;
