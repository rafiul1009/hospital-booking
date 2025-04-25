/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import AuthService from "@/services/api/auth.service";
import { logout } from "@/store/slices/auth";
import { UserState } from "@/types";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export function Nav() {
  const user = useSelector((state: UserState) => state.auth.user)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      AuthService.logout()
        .then(data => {
          dispatch(logout())
        })
        .catch(error => {
          console.log(error);
        })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <nav className="bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="font-semibold text-primary">
              Hospital Booking
            </Link>
            {user && (
              <Link href="/bookings" className="text-gray-600 hover:text-gray-900">
                My Bookings
              </Link>
            )}
          </div>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user.name}</span>
                <button
                  onClick={() => handleLogout()}
                  className="text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}