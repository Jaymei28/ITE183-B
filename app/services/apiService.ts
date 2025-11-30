import { getAccessToken } from "../lib/actions";

const apiService = {
    get: async function (url: string): Promise<any> {
        console.log('get', url);

        const token = await getAccessToken();

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        // If response is not JSON (e.g., HTML error page), return error
                        return response.text().then(text => {
                            console.error('Non-JSON response:', text.substring(0, 200));
                            reject(new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`));
                        });
                    }
                    
                    if (!response.ok) {
                        return response.json().then(json => {
                            console.log('Error Response:', json);
                            resolve(json);
                        }).catch(() => {
                            resolve({ error: `HTTP ${response.status}: ${response.statusText}` });
                        });
                    }
                    
                    return response.json();
                })
                .then((json) => {
                    if (json) {
                        console.log('Response:', json);
                        resolve(json);
                    }
                })
                .catch((error => {
                    console.error('Fetch error:', error);
                    reject(error);
                }))
        })
    },

    post: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);

        const token = await getAccessToken();

        // Check if data is FormData
        const isFormData = data instanceof FormData;
        
        const headers: HeadersInit = {
            'Authorization': `Bearer ${token}`
        };
        
        // Only set Content-Type for JSON, not for FormData (browser sets it automatically)
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                body: isFormData ? data : JSON.stringify(data),
                headers: headers
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(json => {
                            console.log('Error Response:', json);
                            resolve(json);
                        }).catch(() => {
                            resolve({ error: `HTTP ${response.status}: ${response.statusText}` });
                        });
                    }
                    return response.json();
                })
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    console.error('Fetch error:', error);
                    reject(error);
                }))
        })
    },

    postWithoutToken: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(json => {
                            console.log('Error Response:', json);
                            resolve(json);
                        }).catch(() => {
                            resolve({ detail: `HTTP ${response.status}: ${response.statusText}` });
                        });
                    }
                    return response.json();
                })
                .then((json) => {
                    console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    console.error('Fetch error:', error);
                    reject(error);
                }))
        })
    }
}

export default apiService;