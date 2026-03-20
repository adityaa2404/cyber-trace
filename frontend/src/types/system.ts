export interface System {
  system_id: number;
  system_name: string;
  system_type: string;
  department_id: number;
  department_name?: string;
}

export interface SystemCreate {
  system_name: string;
  system_type: string;
  department_id: number;
}

export interface SystemUpdate extends Partial<SystemCreate> {}
