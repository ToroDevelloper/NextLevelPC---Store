import refreshAccessToken from './refreshToken';


let currentAccessToken = null; 

/**
 * Establece el Access Token, típicamente llamado después del login o refresco.
 * @param {string} token - El Access Token.
 */
export const setAuthToken = (token) => {
    currentAccessToken = token;
};

/**
 * Una función fetch que maneja la expiración del Access Token y el refresco.
 * @param {string} url - La URL del recurso protegido.
 * @param {object} options - Opciones de fetch.
 * @returns {Promise<Response>} La respuesta de fetch.
 */
export const authorizedFetch = async (url, options = {}) => {
    
    const makeRequest = async (token) => {
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        };
        
        return fetch(url, { ...options, headers });
    };

    let response = await makeRequest(currentAccessToken);

    if (response.status === 401) {
        console.warn('Access Token expirado. Intentando refrescar...');
        
        try {
            const newAccessToken = await refreshAccessToken();
            
            setAuthToken(newAccessToken);
            
            response = await makeRequest(newAccessToken);

        } catch (refreshError) {
            console.error('El refresh falló, no se pudo reintentar la petición.');
            return response;
        }
    }

    return response;
};