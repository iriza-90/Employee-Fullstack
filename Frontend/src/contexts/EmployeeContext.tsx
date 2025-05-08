import React, { createContext, useState, useContext, useEffect } from "react";
import { axiosInstance } from "./AuthContext";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  salary: number;
  hireDate: string;
  userId: number;
}

interface EmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  salary: number;
  hireDate: string;
}

interface EmployeeContextType {
  employees: Employee[];
  fetchEmployees: () => void;
  addEmployee: (data: EmployeePayload) => Promise<void>;
  updateEmployee: (id: number, data: EmployeePayload) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
  searchEmployees: (query: string) => Promise<void>;
  isLoading: boolean;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployees = async () => {
    if (!user?.id) {
      console.warn("Skipping fetch: no user ID");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const res = await axiosInstance.get("/employees");
      console.log("Raw employee fetch response:", res.data);
  
      const employeesData = Array.isArray(res.data?.employees)
        ? res.data.employees
        : [];
  
      if (employeesData.length === 0) {
        console.warn("No employees found or unexpected format:", res.data);
      }
  
      setEmployees(employeesData);
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      toast.error(error?.response?.data?.message || "Could not fetch employees");
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addEmployee = async (data: EmployeePayload) => {
    try {
      const res = await axiosInstance.post("/employees/create", data);
      setEmployees(prev => [...prev, res.data]);
      toast.success("Employee added successfully!");
    } catch (error: any) {
      console.error("Add employee failed:", error);
      toast.error(error?.response?.data?.message || "Could not add employee");
    }
  };

  const updateEmployee = async (id: number, data: EmployeePayload) => {
    try {
      const res = await axiosInstance.put(`/employees/update/${id}`, data);
      setEmployees(prev => prev.map(emp => (emp.id === id ? res.data : emp)));
      toast.success("Employee updated successfully!");
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error?.response?.data?.message || "Could not update employee");
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      await axiosInstance.delete(`/employees/delete/${id}`);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      toast.success("Employee deleted.");
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error?.response?.data?.message || "Could not delete employee");
    }
  };

  const searchEmployees = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/employees/search?q=${encodeURIComponent(query)}`);
      setEmployees(Array.isArray(res.data) ? res.data : []);
    } catch (error: any) {
      console.error("Search failed:", error);
      toast.error(error?.response?.data?.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchEmployees();
    }
  }, [user?.id]);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        fetchEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        searchEmployees,
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
