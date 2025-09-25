import { api } from '@/api/index'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/alert/toast';

interface ApiResponse<T = any> {
  code: number
  message: string
  count: string
  data: T
}

const enum CompanyQueryKey {
  POST_COMPANY = 'postCompany',
  PUT_COMPANY = 'putCompany',
  DELETE_COMPANY = 'deleteCompany',
  GET_COMPANY_WITH_DEPARTMENTS = 'getCompanyWithDepartments'
}

interface PostCompanyReq {
  company_id: string
  company_name: string
  company_desc: string
}

const usePostCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PostCompanyReq) => {
      const resp: ApiResponse = await api.request({
        method: 'post',
        url: `/company`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      toast.success('회사가 등록되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface PutCompanyReq {
  company_id: string
  company_name: string
  company_desc: string
}

const usePutCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (d: PutCompanyReq) => {
      const resp: ApiResponse = await api.request({
        method: 'put',
        url: `/company/${d.company_id}`,
        data: d
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      toast.success('회사 정보가 수정되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (company_id: string) => {
      const resp: ApiResponse = await api.request({
        method: 'delete',
        url: `/company/${company_id}`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS] });
      toast.success('회사 정보가 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}

interface GetCompanyWithDepartmentsReq {
  company_id: string
}

interface GetCompanyWithDepartmentResp {
  company_id: string
  company_name: string
  company_desc: string
  departments: Array<GetCompanyWithDepartment>
}

interface GetCompanyWithDepartment {
    department_id: number
    department_name: string
    department_name_kr: string
    parent_id: number
    head_user_id: string
    tree_level: number
    department_desc: string
    children: Array<GetCompanyWithDepartment>
}

const useGetCompanyWithDepartments = (reqData: GetCompanyWithDepartmentsReq) => {
  return useQuery({
    queryKey: [CompanyQueryKey.GET_COMPANY_WITH_DEPARTMENTS, reqData.company_id],
    queryFn: async (): Promise<GetCompanyWithDepartmentResp> => {
      const resp: ApiResponse = await api.request({
        method: 'get',
        url: `/company/${reqData.company_id}/departments`
      });

      if (resp.code !== 200) throw new Error(resp.data.data.message);

      return resp.data;
    }
  });
};

export {
  // QueryKey
  CompanyQueryKey,

  // API Hook
  usePostCompany,
  usePutCompany,
  useDeleteCompany,
  useGetCompanyWithDepartments
}

export type {
  // Interface
  PostCompanyReq,
  PutCompanyReq,
  GetCompanyWithDepartmentResp,
  GetCompanyWithDepartment
}