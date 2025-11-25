const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8000';

const apiService = {
  get: async function (url: string): Promise<any> {
    console.log('get', url);

    return new Promise((resolve, reject) => {
      fetch(`${API_HOST}${url}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log('Response:', json);
          resolve(json);
        })
        .catch((error) => {
          console.error('Error:', error);
          reject(error);
        });
    });
  },
};

export default apiService;
