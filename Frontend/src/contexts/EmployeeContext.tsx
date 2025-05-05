
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  joinDate: string;
  phone?: string;
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
  isLoading: boolean;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load employees from localStorage on initial load
    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
      try {
        setEmployees(JSON.parse(storedEmployees));
      } catch (error) {
        console.error("Failed to parse employees from localStorage", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = {
      ...employee,
      id: `emp_${Date.now()}`,
    };
    setEmployees([...employees, newEmployee]);
    toast.success("Employee added successfully");
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, ...updatedFields } : emp
      )
    );
    toast.success("Employee updated successfully");
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast.success("Employee removed successfully");
  };

  const getEmployee = (id: string) => {
    return employees.find((emp) => emp.id === id);
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployee,
        isLoading,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
};
