export interface AttackCategory {
  category_id: number;
  category_name: string;
  description: string | null;
}

export interface AttackType {
  attack_type_id: number;
  attack_type_name: string;
  category_id: number;
  category_name?: string;
}
