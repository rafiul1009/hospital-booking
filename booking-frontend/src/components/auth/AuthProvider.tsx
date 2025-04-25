"use client"

import AuthService from "@/services/api/auth.service";
import StorageService from "@/services/app/storage.service";
import { logout, setUser } from "@/store/slices/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()

  const fetchUserDetails = async () => {
    try {
      if(StorageService.get('user')) {
        AuthService.getUserDetails()
          .then(data => {
            if (data.data) {            
              dispatch(setUser(data.data))            
            } else {
              dispatch(logout())
            }
          })
          .catch(error => {
            console.log(error);          
            dispatch(logout())
          })        
      }
    } catch (error) {
      console.log(error);
      dispatch(logout())
    }
  };

  useEffect(() => {
    fetchUserDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>{ children }</div>
  )
}
