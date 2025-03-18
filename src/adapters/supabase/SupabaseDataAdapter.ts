import {
    createClient,
    SignInWithPasswordCredentials,
    SignUpWithPasswordCredentials,
    SupabaseClient
} from "@supabase/supabase-js";
import {BaseDataAdapter, DataAdapter, DataAdapterConfig, DataProviderResponse} from "../../lib";


export class SupabaseDataAdapter extends BaseDataAdapter implements DataAdapter {
    private supabase: SupabaseClient;

    constructor(config: DataAdapterConfig) {
        super(config);
        if (!config.baseURL) {
            throw new Error("Supabase baseURL (URL del proyecto) es requerido");
        }
        if (!config.token) {
            throw new Error("Supabase token (anon key) es requerido");
        }
        this.supabase = createClient(config.baseURL, config.token);
    }

    private handleResponse<T>(response: { data: T | null; error: any }): DataProviderResponse<T> {
        return {
            data: response.data,
            error: response.error ? { message: response.error.message, status: response.error.status } : null,
        };
    }

    async fetch<TData>(resource: string, query?: Record<string, any>): Promise<DataProviderResponse<TData[]>> {
        const { data, error } = await this.supabase.from(resource).select().match(query || {});
        return this.handleResponse<TData[]>( { data, error });
    }

    async fetchById<TData>(resource: string, id: string | number): Promise<DataProviderResponse<TData>> {
        const { data, error } = await this.supabase.from(resource).select().eq("id", id).single();
        return this.handleResponse<TData>({ data, error });
    }

    async insert<TData, TParams>(resource: string, data: Partial<TParams>): Promise<DataProviderResponse<TData>> {
        const { data: responseData, error } = await this.supabase.from(resource).insert(data).single();
        return this.handleResponse<TData>({ data: responseData, error });
    }

    async modify<TData, TParams>(resource: string, id: string | number, data: Partial<TParams>): Promise<DataProviderResponse<TData>> {
        const { data: responseData, error } = await this.supabase.from(resource).update(data).eq("id", id).single();
        return this.handleResponse<TData>({ data: responseData, error });
    }

    async remove<TData>(resource: string, id: string | number): Promise<DataProviderResponse<TData>> {
        const { data, error } = await this.supabase.from(resource).delete().eq("id", id).single();
        return this.handleResponse<TData>({ data, error });
    }

    async fetchMany<TData>(resource: string, params?: {
        pagination?: { page: number; perPage: number };
        sort?: { field: string; order: 'asc' | 'desc' };
        filter?: Record<string, any>;
    }): Promise<DataProviderResponse<TData[]>> {
        let query = this.supabase.from(resource).select();

        if (params?.filter) {
            Object.keys(params.filter).forEach((key) => {
                query = query.eq(key, params.filter![key]);
            });
        }

        if (params?.sort) {
            query = query.order(params.sort.field, { ascending: params.sort.order === 'asc' });
        }

        if (params?.pagination) {
            const from = (params.pagination.page - 1) * params.pagination.perPage;
            const to = from + params.pagination.perPage - 1;
            query = query.range(from, to);
        }

        const { data, error } = await query;
        return this.handleResponse<TData[]>({ data, error });
    }

    async signIn<TData, TParams>(credentials: TParams): Promise<DataProviderResponse<TData>> {
        const { data, error } = await this.supabase.auth.signInWithPassword(credentials as SignInWithPasswordCredentials);
        return this.handleResponse<TData>({ data: data as TData, error });
    }

    async signUp<TData, TParams>(credentials: Partial<TParams>): Promise<DataProviderResponse<TData>> {
        const { data, error } = await this.supabase.auth.signUp(credentials as unknown as SignUpWithPasswordCredentials);
        return this.handleResponse<TData>({data: data as TData, error });
    }

    async signOut(): Promise<DataProviderResponse<null>> {
        const { error } = await this.supabase.auth.signOut();
        return this.handleResponse<null>({ data: null, error });
    }
}
