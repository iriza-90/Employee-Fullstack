import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import {fetchData, sendData, updateData} from "@/utils/helpers.tsx";
import {servers} from "@/utils/api.tsx";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  salary: number;
  hireDate: string;
}


interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: {
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    salary: number
  }) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployee: (id: string) => Employee | undefined;
  isLoading: boolean;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const loadEmployees = async () => {
      setIsLoading(true);
      const result = await fetchData(`${servers.server1}/employees`, token);
      if (result.data !== -1) {
        setEmployees(result.data.employees); // Assuming backend returns `{ employees: [...] }`
      } else {
        toast.error(result.error);
      }
      setIsLoading(false);
    };

    loadEmployees();
  }, [token]);

  const addEmployee = async (employee: Omit<Employee, "id">) => {
    try {
      const result = await sendData(`${servers.server1}/employees/create`, employee, token);
      if (result.data !== -1) {
        setEmployees([...employees, result.data.employee]); // Assuming backend returns `{ employee: {...} }`
        toast.success("Employee added successfully");
        window.location.href = '/';
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred while adding the employee.");
    }
  };

  const updateEmployee = async (id: string, updatedFields: Partial<Employee>) => {
    const result = await updateData(`${servers.server1}/employees/update/${id}`, updatedFields, token);
    if (result.data !== -1) {
      setEmployees(
          employees.map((emp) =>
              emp.id === id ? { ...emp, ...updatedFields } : emp
          )
      );
      toast.success("Employee updated successfully");
    } else {
      toast.error(result.error);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await axios.delete(`${servers.server1}/employees/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(employees.filter((emp) => emp.id !== id));
      toast.success("Employee deleted successfully");
    } catch (error) {
      const errorMsg =
          error.response?.data?.message || error.message || "Failed to delete employee";
      toast.error(errorMsg);
    }
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
