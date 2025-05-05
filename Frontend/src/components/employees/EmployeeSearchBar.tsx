
import React from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/form-elements";

interface EmployeeSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const EmployeeSearchBar: React.FC<EmployeeSearchBarProps> = ({ 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div className="relative w-full md:w-96">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-gray-500" />
      </div>
      <Input
        type="search"
        placeholder="Search employees"
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default EmployeeSearchBar;
