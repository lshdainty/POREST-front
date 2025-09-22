export interface Company {
  company_id: string;
  company_name: string;
  company_desc: string;
}

export interface Department {
  department_id: number;
  department_name: string;
  department_name_kr: string;
  parent_department_id: number;
  department_level: number;
  department_type: string;
  department_desc: string;
  children_department: Department[];
}