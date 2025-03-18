
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {REALTIME_LISTEN_TYPES} from "@supabase/realtime-js/dist/module/RealtimeChannel";
import {
    BaseRealtimeAdapter,
    RealtimeAdapter,
    RealtimeAdapterConfig,
    RealtimeEvent,
    RealtimeFilter,
    RealtimeSubscription
} from "../../lib";

export class SupabaseRealtimeAdapter extends BaseRealtimeAdapter implements RealtimeAdapter {

    private client?: SupabaseClient;
    private isConnected: boolean = false;

    constructor(config: RealtimeAdapterConfig) {
        super(config);

        if (!this.baseURL || !this.token) {
            throw new Error('SupabaseAdapter requires baseURL and token.');
        }

        this.connect();
    }

    connect() {
        if (this.isConnected) {
            console.log("✅ Supabase ya está conectado.");
            return;
        }

        if (!this.baseURL || !this.token) {
            throw new Error('SupabaseAdapter requires baseURL and token.');
        }

        this.client = createClient(this.baseURL, this.token, this.options);
        this.isConnected = true;

        this.client.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                console.log('✅ Usuario autenticado:', session?.user?.email);
            }
        });

        console.log("🔌 Conectado a Supabase Realtime.");
    }

    disconnect() {
        if (!this.client || !this.isConnected) {
            console.warn("⚠️ No hay conexión activa con Supabase.");
            return;
        }

        const channels = this.client.getChannels();
        channels.forEach(channel => {
            this.client?.removeChannel(channel);
        });

        this.client = undefined;
        this.isConnected = false;

        console.log("❌ Desconectado de Supabase Realtime.");
    }

    async subscribe(
        channel: string,
        filter: RealtimeFilter,
        callback: (event: RealtimeEvent) => void
    ): Promise<RealtimeSubscription> {
        if (!this.client || !this.isConnected) {
            throw new Error("❌ Supabase no está conectado. Llama a `connect()` antes de suscribirte.");
        }

        const channelInstance = this.client
            .channel(channel)
            .on(`${REALTIME_LISTEN_TYPES.SYSTEM}`, {
                event: filter.event || '*',
                schema: filter.schema || 'public',
                table: filter.table,
                filter: typeof filter.filter === 'string'
                    ? filter.filter
                    : this.buildFilter(filter.filter),
            }, (payload) => {
                const event: RealtimeEvent = {
                    eventType: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
                    table: payload.table,
                    schema: payload.schema,
                    record: payload.new,
                    oldRecord: payload.old,
                };
                callback(event);
            })
            .subscribe((status) => {
                if (status !== 'SUBSCRIBED') {
                    console.error(`⚠️ Error al suscribirse al canal ${channel}:`, status);
                }
            });

        return {
            unsubscribe: () => {
                this.client?.removeChannel(channelInstance);
                console.log(`🔌 Canal ${channel} desuscrito.`);
            },
        };
    }

    unsubscribe(channel: string) {
        if (!this.client || !this.isConnected) {
            console.warn("⚠️ No hay conexión activa con Supabase.");
            return;
        }

        const channels = this.client.getChannels();
        const targetChannel = channels.find(ch => ch.topic === channel);

        if (targetChannel) {
            this.client.removeChannel(targetChannel);
            console.log(`❌ Canal ${channel} eliminado.`);
        } else {
            console.warn(`⚠️ Canal ${channel} no encontrado.`);
        }
    }

    private buildFilter(filter?: Record<string, any>): string {
        if (!filter) return '';

        return Object.entries(filter)
            .map(([key, value]) => `${key}=eq.${value}`)
            .join(',');
    }
}
