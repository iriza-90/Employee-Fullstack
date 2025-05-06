import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees, Employee } from '../../contexts/EmployeeContext';
import { Button, Input, FormGroup } from '../ui/form-elements';

interface EmployeeFormProps {
  employee?: Employee;
  isEdit?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, isEdit = false }) => {
  const navigate = useNavigate();
  const { addEmployee, updateEmployee } = useEmployees();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    salary: '',
    hireDate:'',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
    if (!formData.salary || isNaN(Number(formData.salary))) {
      newErrors.salary = 'Valid salary is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      ...formData,
      salary: Number(formData.salary),
    };

    if (isEdit && employee) {
      await updateEmployee(employee.id, payload);
    } else {
      await addEmployee(payload);
    }

    setIsSubmitting(false);
    navigate('/dashboard');
  };

  return (
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <FormGroup>
          <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              error={errors.firstName}
              required
          />
          <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              error={errors.lastName}
              required
          />
          <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
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
          <Input
              label="Hire Date"
              name="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={handleChange}
              error={errors.hireDate}
              required
          />

          <Input
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Enter salary"
              error={errors.salary}
              required
          />

          <div className="flex justify-end space-x-4 mt-6">
            <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEdit ? 'Update Employee' : 'Add Employee'}
            </Button>
          </div>
        </FormGroup>
      </form>
  );
};

export default EmployeeForm;
