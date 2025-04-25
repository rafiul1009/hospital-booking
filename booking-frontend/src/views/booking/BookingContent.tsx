/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import ErrorMessage from "@/components/message/ErrorMessage";
import LoadingSkeleton from "@/components/skeleton/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingService from "@/services/api/booking.service";

import { Booking, UserState } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BookingFormModal } from "./BookingFormModal";

export default function BookingContent() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string>("");
  const [isNewBooking, setIsNewBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);

  const router = useRouter();

  const user = useSelector((state: UserState) => state.auth.user)

  const generateHash = (str: string) => {
    return str.split('').reduce((acc, char) => {
      return (acc << 5) - acc + char.charCodeAt(0);
    }, 0);
  }

  const fetchBookings = async () => {
    try {
      BookingService.getUserBookings()
        .then(data => {
          setIsLoading(false)
          setBookings(data.data)
        })
        .catch(error => {
          setIsLoading(false)
          setError(error.message || 'Login failed. Please try again.');
        })
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleBookingEdit = (booking: Booking) => {
    if (user) {
      setIsAddBookingOpen(true);
      setSelectedBooking(booking);
    } else {
      router.push("/login");
    }
  }

  const handleBookingDelete = (booking: Booking) => {
    if (user) {
      if (booking?.id) {
        try {
          BookingService.deleteBooking(booking.id).then(data => {
            setIsNewBooking(true);
          })
            .catch(error => {
              setIsNewBooking(false);
            })
        } catch (error) {
          setIsNewBooking(false);
        }
      }
    } else {
      router.push("/login");
    }
  }

  const handleAppointmentBookingClose = () => {
    setIsAddBookingOpen(false);
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (isNewBooking) {
      fetchBookings();
      setIsNewBooking(false);
    }
  }, [isNewBooking]);

  return (<div className="container mx-auto px-4">
    <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

    {isLoading ? (
      <LoadingSkeleton />
    ) : error ? (
      <ErrorMessage error={error} onRetry={fetchBookings} />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle>
                Booking ID: #{generateHash("booking" + booking.id)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Service:</span>{" "}
                  {booking?.service?.name}
                </p>
                <p>
                  <span className="font-semibold">Description:</span>{" "}
                  {booking?.service?.description}
                </p>
                <p>
                  <span className="font-semibold">Price:</span>{" "}
                  ${booking?.service?.price.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Start Date:</span>{" "}
                  {new Date(booking.startDate).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">End Date:</span>{" "}
                  {new Date(booking.endDate).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span className={`capitalize ${booking.status === "confirmed"
                    ? "text-green-600"
                    : booking.status === "cancelled"
                      ? "text-red-600"
                      : booking.status === "completed"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}>
                    {booking.status}
                  </span>
                </p>
              </div>

              <div className="flex flex-1 gap-3 mt-2">
                <button
                  onClick={() => handleBookingEdit(booking)}
                  className="w-full bg-sky-800 text-white hover:bg-sky-800/90 px-4 py-2 rounded-md mt-2 cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleBookingDelete(booking)}
                  className="w-full bg-red-800 text-white hover:bg-red-800/90 px-4 py-2 rounded-md mt-2 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        {bookings.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center">
            You don&apos;t have any bookings yet.
          </p>
        )}
      </div>
    )}

    {isAddBookingOpen && (
      <BookingFormModal
        hospital={null}
        booking={selectedBooking}
        isOpen={!!isAddBookingOpen}
        setIsNewBooking={setIsNewBooking}
        onClose={() => handleAppointmentBookingClose()}
      />
    )}
  </div>
  );
}