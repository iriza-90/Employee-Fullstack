
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees, Employee } from '../../contexts/EmployeeContext';
import { Button, Input, Select, FormGroup } from '../ui/form-elements';

interface EmployeeFormProps {
  employee?: Employee;
  isEdit?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, isEdit = false }) => {
  const navigate = useNavigate();
  const { addEmployee, updateEmployee } = useEmployees();

  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    position: employee?.position || '',
    department: employee?.department || '',
    joinDate: employee?.joinDate || new Date().toISOString().split('T')[0],
    phone: employee?.phone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      if (isEdit && employee) {
        updateEmployee(employee.id, formData);
      } else {
        addEmployee(formData);
      }
      
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <FormGroup>
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter employee name"
          error={errors.name}
          required
        />
        
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter employee email"
          error={errors.email}
          required
        />
        
        <Input
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Enter job position"
          error={errors.position}
          required
        />
        
        <Select
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          error={errors.department}
          options={[
            { value: '', label: 'Select department' },
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Marketing', label: 'Marketing' },
            { value: 'Sales', label: 'Sales' },
            { value: 'HR', label: 'HR' },
            { value: 'Finance', label: 'Finance' },
            { value: 'Operations', label: 'Operations' },
          ]}
          required
        />
        
        <Input
          label="Join Date"
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleChange}
          error={errors.joinDate}
          required
        />
        
        <Input
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number (optional)"
        />
        
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            {isEdit ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </FormGroup>
    </form>
  );
};

export default EmployeeForm;
