import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportToExcelButtonProps {
  data: any[];
  fileName?: string;
}

export default function ExportToExcelButton({ data, fileName = "students.xlsx" }: ExportToExcelButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = () => {
    setIsExporting(true);
    try {
      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      // Write workbook to binary array
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      // Create blob and download file
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      saveAs(blob, fileName);

      toast({
        title: "Export Successful",
        description: "Student data has been exported to Excel",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
    }
    setIsExporting(false);
  };

  return (
    <Button variant="outline" className="flex gap-1 items-center" onClick={exportToExcel} disabled={isExporting}>
      <Download className="w-4 h-4" />
      {isExporting ? "Exporting..." : "Export to Excel"}
    </Button>
  );
}