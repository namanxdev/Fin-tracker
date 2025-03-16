import {create} from 'zustand';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/User',
    withCredentials: true,
})

const useAuthStore = create((set)=>({
    user: null,
    login:async(email,password)=>{
        try{
            const response = await api.post('/login',{email,password});
            set({user:response.data.user});
            return response.data;
        }catch(error){
            console.error("Login error:", error);
            throw error;
        }
    },
    register:async(email,password,name)=>{
        try{
            const response = await api.post('/register',{email,password,name});
            set({user:response.data.user});
            return response.data;
        }catch(error){
            console.error("Register error:", error);
            throw error;
        }
    },
    logout:async()=>{
        try{
            const response = await api.post('/logout');
            set({user:null});
            return response.data;
        }catch(error){
            console.error("Logout error:", error);
            throw error;
        }
    },

}))

export default useAuthStore;