// API Client for P2P Academic Library
// Connects to Go backend at /api (proxied via Next.js rewrites)

const BASE_URL = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, {
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        ...options,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data.data;
}

// Auth
export async function login(username: string, password: string) {
    return fetchJSON<{ user: import('./types').User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
}

// Users
export async function getUsers() {
    return fetchJSON<import('./types').User[]>('/users');
}

export async function getUser(id: string) {
    return fetchJSON<import('./types').User>(`/users/${id}`);
}

export async function getUserReputation(id: string) {
    return fetchJSON<import('./types').ReputationInfo>(`/users/${id}/reputation`);
}

export async function getLeaderboard(limit = 10) {
    return fetchJSON<import('./types').User[]>(`/leaderboard?limit=${limit}`);
}

// Resources
export async function getAllResources() {
    return fetchJSON<import('./types').SearchResults>('/resources');
}

export async function getPopularResources(limit = 10) {
    return fetchJSON<import('./types').Resource[]>(`/resources/popular?limit=${limit}`);
}

export async function getRecentResources(limit = 10) {
    return fetchJSON<import('./types').Resource[]>(`/resources/recent?limit=${limit}`);
}

export async function createResource(data: {
    filename: string;
    title: string;
    description: string;
    subject: string;
    tags: string[];
    size: number;
}, userId: string) {
    return fetchJSON<import('./types').Resource>('/resources', {
        method: 'POST',
        headers: { 'X-User-ID': userId },
        body: JSON.stringify(data),
    });
}

export async function downloadResource(id: string, userId: string) {
    return fetchJSON<import('./types').Resource>(`/resources/${id}/download`, {
        method: 'POST',
        headers: { 'X-User-ID': userId },
    });
}

export async function rateResource(id: string, rating: number, comment = '') {
    return fetchJSON<{ resource_id: string; new_rating: number }>(`/resources/${id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
    });
}

// Search
export async function searchResources(query: string, filters?: Record<string, string>) {
    const params = new URLSearchParams({ q: query, ...filters });
    return fetchJSON<import('./types').SearchResults>(`/search?${params}`);
}

export async function getSearchSuggestions(partial: string) {
    return fetchJSON<string[]>(`/search/suggestions?q=${partial}`);
}

// Stats
export async function getNetworkStats() {
    return fetchJSON<import('./types').NetworkStats>('/stats');
}

export async function getLibraryStats() {
    return fetchJSON<import('./types').LibraryStats>('/library/stats');
}

// Peers
export async function getPeers() {
    return fetchJSON<Array<{
        id: string;
        user_id: string;
        username: string;
        status: string;
        reputation: number;
        classification: string;
        shared_resources: number;
        ip_address: string;
    }>>('/peers');
}
