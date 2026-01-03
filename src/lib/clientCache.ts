// Client caching utility for better UX
interface Client {
    id: string;
    customerType: string;
    title: string;
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    country: string;
}

const CACHE_KEY = 'invoice_clients';
const CACHE_EXPIRY_KEY = 'invoice_clients_expiry';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class ClientCache {
    static set(clients: Client[]): void {
        try {
            const now = Date.now();
            localStorage.setItem(CACHE_KEY, JSON.stringify(clients));
            localStorage.setItem(CACHE_EXPIRY_KEY, now.toString());
        } catch (error) {
            console.warn('Failed to cache clients:', error);
        }
    }

    static get(): Client[] | null {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
            
            if (!cached || !expiry) {
                return null;
            }

            const now = Date.now();
            const cacheTime = parseInt(expiry, 10);
            
            // Check if cache is expired
            if (now - cacheTime > CACHE_DURATION) {
                this.clear();
                return null;
            }

            return JSON.parse(cached);
        } catch (error) {
            console.warn('Failed to retrieve cached clients:', error);
            this.clear();
            return null;
        }
    }

    static clear(): void {
        try {
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_EXPIRY_KEY);
        } catch (error) {
            console.warn('Failed to clear client cache:', error);
        }
    }

    static isExpired(): boolean {
        try {
            const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
            if (!expiry) return true;

            const now = Date.now();
            const cacheTime = parseInt(expiry, 10);
            return now - cacheTime > CACHE_DURATION;
        } catch (error) {
            return true;
        }
    }
}