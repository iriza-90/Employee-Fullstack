import {jwtDecode} from "jwt-decode";
import axios from "axios";


export async function fetchData(url, token) {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { data: response.data, message: response.data.message };
    } catch (error) {
        let errorMessage = "Server is down";

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return { error: errorMessage, data: -1 };
    }
}

export async function sendData(url,data,token) {
    try {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        const response = await axios.post(url,data);
        return {data:response.data,message:response.data.message};
    } catch (error) {
        let errorMessage = "Server is down";

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return { error: errorMessage, data: -1 };
    }
}

export async function updateData(url,data,token) {
    try {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        const response = await axios.put(url,data);
        return {data:response.data,message:response.data.message};
    } catch (error) {
        let errorMessage = "Server is down";

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return { error: errorMessage, data: -1 };
    }
}

export function handleLogout(tokenName){
    localStorage.removeItem(tokenName);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.location = "/";
}

export const decodeToken =() => {
    const token = localStorage.getItem('buu_client_token'); // Replace 'your_token_key' with the actual key used in local storage
    if (!token) {
        return null;
    }
    try {
        const decoded = jwtDecode(token);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const { image, name, ...otherProperties } = decoded;
        return { image, name, ...otherProperties };
    } catch (error) {
        return null;
    }
};




