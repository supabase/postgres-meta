export namespace Roles {

  export interface Role {
    name: string
    id: number
    has_create_db_privileges: boolean
    is_super_user: boolean
    has_replication_privileges: boolean
    can_bypass_rls: boolean
    valid_until: string | null
    user_config: string | null
    connections: number
    max_user_connections: number
    max_db_connections: number,
    grants: Grants[]
  }

  export interface Grants {
    table_id: string
    grantor: string
    grantee: string
    catalog: string
    schema: string
    table_name: string
    privilege_type: string
    is_grantable: boolean
    with_hierarchy: boolean
  }


}
