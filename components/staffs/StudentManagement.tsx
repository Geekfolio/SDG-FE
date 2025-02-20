"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Download, Filter, ChevronDown, Search, BarChart, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import ExportToExcelButton from "./ExportToExcel";

const departments = ["CS", "ECE", "IT", "Civil", "Mechanical", "Electrical"];
const years = ["Year 1", "Year 2", "Year 3", "Year 4"];
const statuses = ["In Class", "On Duty", "Hackathon", "Internship", "Leave", "Workshop"];
const events = [
  "National Coding Championship",
  "IEEE Conference",
  "ProjectX Expo",
  "AI Hackathon",
  "Robotics Challenge",
  "Design Sprint",
  "Cyber Security Workshop",
  "IoT Workshop",
  "Start-up Weekend",
  "Tech Fest 2024",
];

// Enhanced mock data with more fields and realistic values
const generateMockStudents = () => {
  const studentsData = Array.from({ length: 180 }, (_, i) => {
    const studentId = i + 1;
    const hackathonsParticipated = Math.floor(Math.random() * 10);
    const hackathonsWon = Math.min(Math.floor(Math.random() * 4), hackathonsParticipated);
    const eventsParticipated = Array.from({ length: Math.floor(Math.random() * 6) }, () => 
      events[Math.floor(Math.random() * events.length)]
    ).filter((value, index, self) => self.indexOf(value) === index);
    
    const department = departments[Math.floor(Math.random() * departments.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    // const gpa = (Math.random() * 3 + 7).toFixed(2);
    
    return {
      id: studentId,
      name: `Student ${studentId}`,
      rollNumber: `R${String(studentId).padStart(3, "0")}`,
      class: `Class ${["A", "B", "C"][Math.floor(i / 60)]}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      hackathonsParticipated,
      hackathonsWon,
      eventsParticipated,
      year,
      department,
      // gpa: parseFloat(gpa),
      attendancePercentage: Math.floor(Math.random() * 20 + 80),
      skills: ["JavaScript", "Python", "React", "Node.js", "Data Science", "UI/UX", "Machine Learning"]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 4 + 1)),
      lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    };
  });
  return studentsData;
};

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  interface ChartConfig {
    type: 'bar' | 'line' | 'pie';
    data: any;
    options: any;
}
  interface Student {
    id: number;
    name: string;
    rollNumber: string;
    class: string;
    status: string;
    hackathonsParticipated: number;
    hackathonsWon: number;
    eventsParticipated: string[];
    year: string;
    department: string;
    // gpa: number;
    attendancePercentage: number;
    skills: string[];
    lastLogin: string;
  }
  
  const [students, setStudents] = useState<Student[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [chartType, setChartType] = useState("departments");
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const [activeFilters, setActiveFilters] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
  const [sortKey, setSortKey] = useState<keyof Student | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Simulate loading data from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      setStudents(generateMockStudents());
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (selectedYear !== "All") count++;
    if (selectedDepartment !== "All") count++;
    if (selectedClass !== "All") count++;
    if (selectedStatus !== "All") count++;
    if (searchTerm) count++;
    setActiveFilters(count);
  }, [selectedYear, selectedDepartment, selectedClass, selectedStatus, searchTerm]);

  // Filter students based on search and filter criteria
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === "" ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = selectedYear === "All" || student.year === selectedYear;
    const matchesDepartment =
      selectedDepartment === "All" || student.department === selectedDepartment;
    const matchesClass =
      selectedClass === "All" || student.class === selectedClass;
    const matchesStatus =
      selectedStatus === "All" || student.status === selectedStatus;

    return matchesSearch && matchesYear && matchesDepartment && matchesClass && matchesStatus;
  });

  // Sorting function
  const sortedStudents = React.useMemo(() => {
    let sortableItems = [...filteredStudents];
    if (sortConfig.key) {
      const key = sortConfig.key as keyof Student;
      sortableItems.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredStudents, sortConfig]);

  interface SortConfig {
    key: keyof Student | null;
    direction: 'ascending' | 'descending';
  }

  const requestSort = (key: keyof Student): void => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setSortKey(key);
  };

  // Analytics data preparation
  const prepareAnalyticsData = () => {
    // Department distribution
    const departmentCounts = departments.map(dept => {
      return students.filter(student => student.department === dept).length;
    });

    // Hackathon participation by year
    const hackathonsByYear = years.map(year => {
      const studentsInYear = students.filter(student => student.year === year);
      return studentsInYear.reduce((sum, student) => sum + student.hackathonsParticipated, 0);
    });

    // Hackathon wins by department
    const winsByDepartment = departments.map(dept => {
      const studentsInDept = students.filter(student => student.department === dept);
      return studentsInDept.reduce((sum, student) => sum + student.hackathonsWon, 0);
    });

    // Average GPA by department
    // const gpaByDepartment = departments.map(dept => {
    //   const studentsInDept = students.filter(student => student.department === dept);
    //   const totalGpa = studentsInDept.reduce((sum, student) => sum + student.gpa, 0);
    //   return totalGpa / (studentsInDept.length || 1);
    // });

    // Status distribution
    const statusCounts = statuses.map(status => {
      return students.filter(student => student.status === status).length;
    });

    return {
      departmentCounts,
      hackathonsByYear,
      winsByDepartment,
      // gpaByDepartment,
      statusCounts
    };
  };

  // Export functions
  const exportToExcel = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      // Simulate export process
      toast({
        title: "Export Successful",
        description: "Student data has been exported to Excel",
      });
      setIsExporting(false);
    }, 2000);
  };

  // Animation variants
  interface RowVariant {
    [key: string]: any;
    hidden: {
      opacity: number;
      y: number;
    };
    visible: (index: number) => {
      opacity: number;
      y: number;
      transition: {
        delay: number;
        duration: number;
        ease: string;
      };
    };
    exit: {
      opacity: number;
      y: number;
      transition: {
        duration: number;
      };
    };
  }

  const rowVariants: RowVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: index * 0.03,
        duration: 0.3,
        ease: "easeInOut"
      }
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedYear("All");
    setSelectedDepartment("All");
    setSelectedClass("All");
    setSelectedStatus("All");
    setSortConfig({ key: null, direction: 'ascending' });
    setSortKey(null);
  };

  // Get chart configuration based on selected chart type
  const getChartConfig = (): ChartConfig => {
    const analyticsData = prepareAnalyticsData();
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
        easing: "easeInOutCubic"
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 12
          },
          cornerRadius: 4,
          displayColors: true
        }
      }
    };

    switch (chartType) {
      case 'departments':
        return {
          type: 'bar' as const,
          data: {
            labels: departments,
            datasets: [{
              label: 'Number of Students',
              data: analyticsData.departmentCounts,
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderColor: 'rgb(37, 99, 235)',
              borderWidth: 1
            }]
          },
          options: {
            ...commonOptions,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Student Count'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Department'
                }
              }
            },
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Student Distribution by Department',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            }
          }
        };
      
      case 'hackathons':
        return {
          type: 'bar' as const,
          data: {
            labels: years,
            datasets: [{
              label: 'Hackathons Participated',
              data: analyticsData.hackathonsByYear,
              backgroundColor: 'rgba(139, 92, 246, 0.7)',
              borderColor: 'rgb(109, 40, 217)',
              borderWidth: 1
            }]
          },
          options: {
            ...commonOptions,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Total Participations'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Year'
                }
              }
            },
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Hackathon Participation by Year',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            }
          }
        };
      
      case 'wins':
        return {
          type: 'line' as const,
          data: {
            labels: departments,
            datasets: [{
              label: 'Hackathon Wins',
              data: analyticsData.winsByDepartment,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              borderColor: 'rgb(5, 150, 105)',
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: 'rgb(5, 150, 105)'
            }]
          },
          options: {
            ...commonOptions,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Total Wins'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Department'
                }
              }
            },
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Hackathon Wins by Department',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            }
          }
        };
      
      // case 'gpa':
      //   return {
      //     type: 'bar' as const,
      //     data: {
      //       labels: departments,
      //       datasets: [{
      //         label: 'Average GPA',
      //         data: analyticsData.gpaByDepartment,
      //         backgroundColor: 'rgba(245, 158, 11, 0.7)',
      //         borderColor: 'rgb(217, 119, 6)',
      //         borderWidth: 1
      //       }]
      //     },
      //     options: {
      //       ...commonOptions,
      //       scales: {
      //         y: {
      //           min: 7,
      //           max: 10,
      //           title: {
      //             display: true,
      //             text: 'GPA'
      //           }
      //         },
      //         x: {
      //           title: {
      //             display: true,
      //             text: 'Department'
      //           }
      //         }
      //       },
      //       plugins: {
      //         ...commonOptions.plugins,
      //         title: {
      //           display: true,
      //           text: 'Average GPA by Department',
      //           font: {
      //             size: 16,
      //             weight: 'bold'
      //           }
      //         }
      //       }
      //     }
      //   };
      
      case 'status':
        return {
          type: 'pie' as const,
          data: {
            labels: statuses,
            datasets: [{
              data: analyticsData.statusCounts,
              backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(239, 68, 68, 0.7)',
                'rgba(139, 92, 246, 0.7)',
                'rgba(107, 114, 128, 0.7)',
              ],
              borderColor: [
                'rgb(37, 99, 235)',
                'rgb(5, 150, 105)',
                'rgb(217, 119, 6)',
                'rgb(220, 38, 38)',
                'rgb(109, 40, 217)',
                'rgb(75, 85, 99)',
              ],
              borderWidth: 1
            }]
          },
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Current Student Status Distribution',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            }
          }
        };
      
      default:
        return {
          type: 'bar' as const,
          data: {
            labels: departments,
            datasets: [{
              label: 'Number of Students',
              data: analyticsData.departmentCounts,
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderColor: 'rgb(37, 99, 235)',
              borderWidth: 1
            }]
          },
          options: commonOptions
        };
    }
  };

  // Render the appropriate chart based on type
  const renderChart = () => {
    const config: ChartConfig = getChartConfig();
    const analyticsData = prepareAnalyticsData();
    
    switch (config.type) {
      case 'bar':
        return <Bar data={config.data} options={config.options} className="h-96" />;
      case 'line':
        return <Line data={config.data} options={config.options} className="h-96" />;
      case 'pie':
        return <Pie data={config.data} options={config.options} className="h-96" />;
      default:
        return <Bar data={config.data} options={config.options} className="h-96" />;
    }
  };

  // Determine status badge color
  interface StatusColorMap {
    [key: string]: string;
  }

  const getStatusBadgeColor = (status: string): string => {
    const statusColors: StatusColorMap = {
      "In Class": "bg-green-100 text-green-800",
      "On Duty": "bg-blue-100 text-blue-800",
      "Hackathon": "bg-purple-100 text-purple-800",
      "Internship": "bg-yellow-100 text-yellow-800",
      "Leave": "bg-red-100 text-red-800",
      "Workshop": "bg-indigo-100 text-indigo-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Tabs defaultValue="students" className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="students" className="text-sm font-medium">
            Students
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm font-medium" onClick={() => setShowAnalytics(true)}>
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <div className="flex gap-2">
            <ExportToExcelButton data={students} />
        </div>
      </div>

      <TabsContent value="students" className="space-y-4">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Student Management</CardTitle>
            <CardDescription>
              Manage, filter, and view student participation in hackathons and events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3 justify-between items-center">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or roll number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-[280px]"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                  {activeFilters > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="flex items-center gap-1 text-xs"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Clear filters ({activeFilters})
                      </Button>
                    </motion.div>
                  )}
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Filter className="h-4 w-4" />
                        Filters
                        {activeFilters > 0 && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {activeFilters}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[220px]" align="end">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Filter by Year</h4>
                          <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All Years</SelectItem>
                              {years.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Filter by Department</h4>
                          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All Departments</SelectItem>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Filter by Class</h4>
                          <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All Classes</SelectItem>
                              <SelectItem value="Class A">Class A</SelectItem>
                              <SelectItem value="Class B">Class B</SelectItem>
                              <SelectItem value="Class C">Class C</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Filter by Status</h4>
                          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All Statuses</SelectItem>
                              {statuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  {filteredStudents.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <Search className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No matching students found</h3>
                      <p className="mt-1 text-gray-500 max-w-md">
                        Try adjusting your search or filter criteria to find what you're looking for.
                      </p>
                      <Button 
                        variant="link" 
                        onClick={resetFilters}
                        className="mt-4"
                      >
                        Reset all filters
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table ref={tableRef}>
                          <TableHeader>
                            <TableRow>
                              <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort('rollNumber')}
                              >
                                Roll Number
                                {sortKey === 'rollNumber' && (
                                  <span className="ml-1">
                                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort('name')}
                              >
                                Name
                                {sortKey === 'name' && (
                                  <span className="ml-1">
                                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort('year')}
                              >
                                Year
                                {sortKey === 'year' && (
                                  <span className="ml-1">
                                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort('department')}
                              >
                                Department
                                {sortKey === 'department' && (
                                  <span className="ml-1">
                                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort('class')}
                              >
                                Class
                                {sortKey === 'class' && (
                                  <span className="ml-1">
                                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort('status')}
                              >
                                Status
                                {sortKey === 'status' && (
                                  <span className="ml-1">
                                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort('hackathonsParticipated')}
                              >
                                Hackathons
                                {sortKey === 'hackathonsParticipated' && (
                                  <span className="ml-1">
{sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                  </span>
                                )}
                              </TableHead>
                              <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort('hackathonsWon')}
                              >
                                Wins
                                {sortKey === 'hackathonsWon' && (
                                  <span className="ml-1">
                                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                  </span>
                                )}
                              </TableHead>
                              {/* <TableHead
                                className="cursor-pointer"
                                onClick={() => requestSort('gpa')}
                              >
                                GPA
                                {sortKey === 'gpa' && (
                                  <span className="ml-1">
                                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                  </span>
                                )}
                              </TableHead> */}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <AnimatePresence>
                              {sortedStudents.map((student, index) => (
                                <motion.tr
                                  key={student.id}
                                  custom={index}
                                  variants={rowVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  layoutId={`student-${student.id}`}
                                  className="group hover:bg-gray-50"
                                >
                                  <TableCell className="font-medium">
                                    <Link
                                      href={`/student/${student.id}`}
                                      className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      {student.rollNumber}
                                    </Link>
                                  </TableCell>
                                  <TableCell>{student.name}</TableCell>
                                  <TableCell>{student.year}</TableCell>
                                  <TableCell>{student.department}</TableCell>
                                  <TableCell>{student.class}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={`${getStatusBadgeColor(student.status)} transition-all duration-200`}
                                    >
                                      {student.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {student.hackathonsParticipated}
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <ChevronDown className="h-3 w-3" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Event Participation for {student.name}</DialogTitle>
                                          <DialogDescription>
                                            List of events and hackathons this student has participated in.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <ScrollArea className="max-h-[300px] pr-3">
                                          <div className="space-y-3">
                                            {student.eventsParticipated.length > 0 ? (
                                              student.eventsParticipated.map((event, i) => (
                                                <div
                                                  key={i}
                                                  className="p-3 border rounded-md flex items-start gap-3"
                                                >
                                                  <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                                                    {i + 1}
                                                  </div>
                                                  <div>
                                                    <h4 className="font-medium">{event}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                      {["Participated", "Winner", "Runner-up"][Math.floor(Math.random() * 3)]}
                                                    </p>
                                                  </div>
                                                </div>
                                              ))
                                            ) : (
                                              <p className="text-center text-gray-500 py-6">
                                                No recorded participation in events.
                                              </p>
                                            )}
                                          </div>
                                        </ScrollArea>
                                      </DialogContent>
                                    </Dialog>
                                  </TableCell>
                                  <TableCell>
                                    {student.hackathonsWon > 0 ? (
                                      <span className="text-green-600 font-medium">
                                        {student.hackathonsWon}
                                      </span>
                                    ) : (
                                      student.hackathonsWon
                                    )}
                                  </TableCell>
                                  {/* <TableCell>
                                    <span
                                      className={
                                        student.gpa >= 9
                                          ? "text-green-600 font-medium"
                                          : student.gpa >= 8
                                          ? "text-blue-600"
                                          : "text-gray-600"
                                      }
                                    >
                                      {student.gpa.toFixed(2)}
                                    </span>
                                  </TableCell> */}
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredStudents.length}</span> of{" "}
                  <span className="font-medium">{students.length}</span> students
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={true}
                    className="text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={true}
                    className="text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Student Analytics</CardTitle>
            <CardDescription>
              Visualize participation and performance metrics across departments and years.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex flex-wrap gap-3 justify-between items-center">
                <div className="space-x-2">
                  <Button
                    variant={chartType === 'departments' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('departments')}
                  >
                    Departments
                  </Button>
                  <Button
                    variant={chartType === 'hackathons' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('hackathons')}
                  >
                    Hackathons
                  </Button>
                  <Button
                    variant={chartType === 'wins' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('wins')}
                  >
                    Wins
                  </Button>
                  {/* <Button
                    variant={chartType === 'gpa' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('gpa')}
                  >
                    GPA
                  </Button> */}
                  <Button
                    variant={chartType === 'status' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('status')}
                  >
                    Status
                  </Button>
                </div>
              </div>
              
              <div className="relative h-96 border rounded-md bg-gradient-to-br from-gray-50 to-white p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={chartType}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                  >
                    {renderChart()}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Hackathon Participation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {students.reduce((sum, student) => sum + student.hackathonsParticipated, 0)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Total participations this year</p>
                  </CardContent>
                </Card>
                
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Average GPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {(students.reduce((sum, student) => sum + student.gpa, 0) / students.length).toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Across all departments</p>
                  </CardContent>
                </Card> */}
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Students on Hackathons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {students.filter(student => student.status === "Hackathon").length}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Currently participating</p>
                  </CardContent>
                </Card>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Top Performers</h3>
                <ScrollArea className="h-[220px]">
                  <div className="space-y-2">
                    {students
                      .sort((a, b) => b.hackathonsWon - a.hackathonsWon)
                      .slice(0, 5)
                      .map((student, index) => (
                        <motion.div
                          key={student.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 border rounded-md flex items-center gap-4"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800">
                            {index + 1}
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-gray-500">
                              {student.department}, {student.year}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{student.hackathonsWon}</div>
                            <p className="text-sm text-gray-500">Wins</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}