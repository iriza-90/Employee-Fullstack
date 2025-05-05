
import React from "react";

interface PaginationInfoProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({ 
  startIndex, 
  endIndex, 
  totalItems 
}) => {
  return (
    <div className="text-sm text-gray-500">
      Showing {totalItems > 0 ? startIndex + 1 : 0} to {endIndex} of {totalItems} employees
    </div>
  );
};

export default PaginationInfo;
