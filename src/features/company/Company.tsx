
import { useState } from 'react';
import { Button } from '@/components/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/shadcn/card';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/shadcn/sheet';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Mock Data (as APIs are not available yet)
const mockCompanies = [
  { id: 'c1', name: 'BigXData' },
  { id: 'c2', name: 'InsightON' },
  { id: 'c3', name: 'SK A&X' },
];

const mockDepartments = {
  c1: [
    { id: 'd1', name: 'AI Platform' },
    { id: 'd2', name: 'DX' },
  ],
  c2: [{ id: 'd3', name: 'Consulting' }],
  c3: [{ id: 'd4', name: 'Cloud Native' }],
};

const mockUsers = {
  d1: [
    { id: 'u1', name: 'John Doe' },
    { id: 'u2', name: 'Jane Smith' },
  ],
  d2: [{ id: 'u3', name: 'Peter Jones' }],
  d3: [{ id: 'u4', name: 'Mary Williams' }],
  d4: [{ id: 'u5', name: 'David Brown' }],
};

export default function Company() {
  const [companies, setCompanies] = useState(mockCompanies);
  const [departments, setDepartments] = useState(mockDepartments);
  const [users, setUsers] = useState(mockUsers);

  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [selectedDepartment, setSelectedDepartment] = useState(departments[selectedCompany.id][0]);

  const CompanySheet = ({ company, children }) => (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{company ? 'Edit Company' : 'Add Company'}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" defaultValue={company?.name} className="col-span-3" />
          </div>
        </div>
        <Button type="submit">Save changes</Button>
      </SheetContent>
    </Sheet>
  );

  const DepartmentSheet = ({ department, children }) => (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{department ? 'Edit Department' : 'Add Department'}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" defaultValue={department?.name} className="col-span-3" />
          </div>
        </div>
        <Button type="submit">Save changes</Button>
      </SheetContent>
    </Sheet>
  );
  
  const UserSheet = ({ children }) => (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add User to Department</SheetTitle>
        </SheetHeader>
        {/* User add form will be here */}
        <p>User selection and add logic will be implemented here.</p>
        <Button type="submit">Add User</Button>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="h-full w-full p-4">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-lg border">
        {/* Companies Panel */}
        <ResizablePanel defaultSize={25}>
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Companies</CardTitle>
              <CompanySheet>
                <Button variant="ghost" size="icon"><PlusCircle className="h-5 w-5" /></Button>
              </CompanySheet>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedCompany?.id === company.id ? 'bg-muted' : ''}`}
                  onClick={() => {
                    setSelectedCompany(company);
                    setSelectedDepartment(departments[company.id]?.[0]);
                  }}
                >
                  <span>{company.name}</span>
                  <div className="flex items-center">
                    <CompanySheet company={company}>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    </CompanySheet>
                    <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </ResizablePanel>
        <ResizableHandle withHandle />

        {/* Departments Panel */}
        <ResizablePanel defaultSize={35}>
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{selectedCompany?.name} Departments</CardTitle>
              <DepartmentSheet>
                <Button variant="ghost" size="icon" disabled={!selectedCompany}><PlusCircle className="h-5 w-5" /></Button>
              </DepartmentSheet>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {selectedCompany && departments[selectedCompany.id]?.map((dept) => (
                <div
                  key={dept.id}
                  className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedDepartment?.id === dept.id ? 'bg-muted' : ''}`}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <span>{dept.name}</span>
                  <div className="flex items-center">
                    <DepartmentSheet department={dept}>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    </DepartmentSheet>
                    <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
              {!selectedCompany && <p className="text-muted-foreground">Select a company to see its departments.</p>}
            </CardContent>
          </Card>
        </ResizablePanel>
        <ResizableHandle withHandle />

        {/* Users Panel */}
        <ResizablePanel defaultSize={40}>
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{selectedDepartment?.name} Users</CardTitle>
              <UserSheet>
                <Button variant="ghost" size="icon" disabled={!selectedDepartment}><PlusCircle className="h-5 w-5" /></Button>
              </UserSheet>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              {selectedDepartment && users[selectedDepartment.id]?.map((user) => (
                <div key={user.id} className="p-2 rounded-md flex justify-between items-center">
                  <span>{user.name}</span>
                  <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              {!selectedDepartment && <p className="text-muted-foreground">Select a department to see its users.</p>}
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
