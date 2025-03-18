
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {BasePermissionAdapter, Permission, Role} from "../../lib";
import {User} from "../../types";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


export class SupabasePermissionAdapter<T extends User> extends BasePermissionAdapter<T> {
    private supabase: SupabaseClient;

    constructor(authUser: T, guard?: string) {
        super(authUser, guard);
        this.supabase = createClient(supabaseUrl, supabaseAnonKey);
        this.fetchUserPermissions();
    }

    async fetchUserPermissions(): Promise<void> {
        if (!this.authUser.id) return;

        const { data, error } = await this.supabase
            .from('user_permissions') // Asume que tienes una tabla con permisos
            .select('permissions(*), roles(*)')
            .eq('user_id', this.authUser.id);

        if (error) {
            console.error("Error fetching permissions:", error);
            return;
        }

        if (data) {
            this.authUser.roles = data.map((item: any) => item.roles);
            this.authUser.permissions = data.map((item: any) => item.permissions);
        }
    }

    can(action: string): boolean {
        return this.authUser.permissions?.some(permission => permission.name === action) ?? false;
    }

    update(roles: Role[], permissions: Permission[]): void {
        this.authUser.roles = roles;
        this.authUser.permissions = permissions;
    }
}
