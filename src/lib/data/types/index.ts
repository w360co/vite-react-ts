import {Store} from "redux";

export type DataProviderError = {
    message: string;
    code?: number | string;
    status?: number;
    originalError?: unknown;
};

export type DataProviderResponse<T> = {
    data: T | null;
    error: DataProviderError | null;
};

export interface DataAdapterConfig{
    token?: string
    baseURL?: string;
    store?: Store;
    reducers?: Record<string, any>;
    options?: Record<string, any>;
    headers?: Record<string, string>;
}

export interface DataAdapter {
    fetch<TData>(resource: string, query?: Record<string, any>): Promise<DataProviderResponse<TData[]>>;
    fetchById<TData>(resource: string, id: string | number): Promise<DataProviderResponse<TData>>;
    insert<TData, TParams>(resource: string, data: Partial<TParams>): Promise<DataProviderResponse<TData>>;
    modify<TData, TParams>(resource: string, id: string | number, data: Partial<TParams>): Promise<DataProviderResponse<TData>>;
    remove<TData>(resource: string, id: string | number): Promise<DataProviderResponse<TData>>;
    fetchMany<TData>(resource: string, params?: {
        pagination?: { page: number; perPage: number };
        sort?: { field: string; order: 'asc' | 'desc' };
        filter?: Record<string, any>;
    }): Promise<DataProviderResponse<TData[]>>;

    signIn<TData, TParams>(credentials: TParams): Promise<DataProviderResponse<TData>>
    signUp<TData, TParams>(credentials: Partial<TParams>): Promise<DataProviderResponse<TData>>
    signOut(): Promise<DataProviderResponse<null>>
}

export interface DataProviderConfig {
    adapter?: DataAdapter;
}

export abstract class BaseDataAdapter {
    protected baseURL?: string;
    protected token?: string;
    protected reducers?: Record<string, string>;
    protected headers?: Record<string, string>;
    protected options?: Record<string, any>;
    protected store?: Store;

    constructor(config?: DataAdapterConfig) {
        this.baseURL = config?.baseURL;
        this.token = config?.token;
        this.headers = config?.headers;
        this.store = config?.store;
        this.reducers = config?.reducers;
        this.options = config?.options;
    }
}
