
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/form-elements";
import { useNavigate } from "react-router-dom";
import EmployeeSearchBar from "./EmployeeSearchBar";

interface EmployeeListHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const EmployeeListHeader: React.FC<EmployeeListHeaderProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <EmployeeSearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <Button
        onClick={() => navigate('/employees/add')}
        className="w-full md:w-auto"
      >
        <Plus className="w-5 h-5 mr-2" /> Add Employee
      </Button>
    </div>
  );
};

export default EmployeeListHeader;
