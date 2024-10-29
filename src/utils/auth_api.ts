import { apiUrl } from "../api";
import axios from "axios";

const getAccessToken = () => localStorage.getItem("access_token");

const createHeaders = () => ({
  access_token: getAccessToken(),
});

export const _GET = async (endpoint: string) => {
  try {
    const response = await axios.get(`${apiUrl}${endpoint}`, {
      headers: createHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

export const _POST = async (endpoint: string, reqBody: any) => {
  try {
    const response = await axios.post(`${apiUrl}${endpoint}`, reqBody, {
      headers: createHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

export const _PUT = async (endpoint: string, reqBody: any) => {
  try {
    const response = await axios.put(`${apiUrl}${endpoint}`, reqBody, {
      headers: createHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("PUT request error:", error);
    throw error;
  }
};

export const _DELETE = async (endpoint: string) => {
  try {
    const response = await axios.delete(`${apiUrl}${endpoint}`, {
      headers: createHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};