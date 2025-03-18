import {
    RealtimeAdapter,
    RealtimeEvent,
    RealtimeFilter,
    RealtimeProviderConfig,
    RealtimeSubscription
} from "../types";

export class RealtimeProvider {
    private adapter: RealtimeAdapter;
    private subscriptions: Map<string, RealtimeSubscription> = new Map();

    constructor(config: RealtimeProviderConfig) {
        if (!config?.adapter) {
            throw new Error("RealtimeProvider requires a valid adapter instance.");
        }
        this.adapter = config.adapter;
    }

    async subscribe(
        channel: string,
        filter: RealtimeFilter,
        callback: (event: RealtimeEvent) => void
    ): Promise<() => void> {
        if (!channel) {
            throw new Error("Cannot subscribe: channel name is required.");
        }

        if (this.subscriptions.has(channel)) {
            console.warn(`⚠️ Already subscribed to channel: ${channel}, resubscribing...`);
            await this.unsubscribe(channel);
        }

        try {
            const subscription = await this.adapter.subscribe(channel, filter, callback);
            this.subscriptions.set(channel, subscription);
            console.log(`✅ Subscribed to channel: ${channel}`);

            return () => this.unsubscribe(channel);
        } catch (error) {
            console.error(`❌ Error subscribing to channel: ${channel}`, error);
            throw error;
        }
    }

    private async unsubscribe(channel: string): Promise<void> {
        if (!channel) {
            console.warn("⚠️ Cannot unsubscribe: channel name is required.");
            return;
        }

        const subscription = this.subscriptions.get(channel);
        if (!subscription) {
            console.warn(`⚠️ No active subscription found for channel: ${channel}`);
            return;
        }

        try {
            subscription.unsubscribe();
            this.subscriptions.delete(channel);
            console.log(`🔕 Unsubscribed from channel: ${channel}`);
        } catch (error) {
            console.error(`❌ Error unsubscribing from channel: ${channel}`, error);
        }
    }

    async unsubscribeAll(): Promise<void> {
        const channels = Array.from(this.subscriptions.keys());

        if (channels.length === 0) {
            console.warn("⚠️ No active subscriptions to unsubscribe from.");
            return;
        }

        console.log(`🔄 Unsubscribing from all ${channels.length} channels...`);
        await Promise.all(channels.map(channel => this.unsubscribe(channel)));
        console.log("✅ All subscriptions cleared.");
    }
}
