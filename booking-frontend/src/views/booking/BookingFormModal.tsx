/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Booking, Hospital, Service, UserState } from "@/types";
import { useRouter } from "next/navigation";
import { Spinner } from "../../components/ui/spinner";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import BookingService from "@/services/api/booking.service";
import HospitalService from "@/services/api/hospital.service";

interface BookingModalProps {
  hospital: Hospital | null;
  isOpen: boolean;
  onClose: () => void;
  setIsNewBooking?: (value: boolean) => void;
  booking?: Booking | null;
}

interface BookingFormValues {
  serviceId: string;
  startDate: string;
  endDate: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export function BookingFormModal({ hospital, isOpen, onClose, setIsNewBooking, booking }: BookingModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state: UserState) => state.auth.user)
  const router = useRouter();

  const form = useForm<BookingFormValues>({
    defaultValues: {
      serviceId: booking?.serviceId.toString() || "",
      startDate: booking?.startDate ? new Date(booking.startDate).toISOString().slice(0, 16) : "",
      endDate: booking?.endDate ? new Date(booking.endDate).toISOString().slice(0, 16) : "",
      status: booking?.status
    },
  });

  const fetchHospitalServices = async () => {
    try {
      console.log("booking", booking);

      if (booking?.service?.hospitalId) {
        HospitalService.getAllServicesByHospital(booking?.service?.hospitalId)
          .then(data => {
            setIsLoading(false)
            setServices(data.data)
          })
          .catch(error => {
            setIsLoading(false)
            setError(error.message || 'Login failed. Please try again.');
          })
      }

    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (hospital) {
        setServices(hospital.services);
        setIsLoading(false);
      } else {
        fetchHospitalServices();
      }
    }
  }, [isOpen]);


  const onSubmit = async (values: BookingFormValues) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // Validate dates
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);

      if (endDate <= startDate) {
        setError("End date must be after start date");
        return;
      }

      const createFormData: Omit<Booking, 'id' | 'userId' | 'hospitalId' | 'createdAt' | 'updatedAt' | 'status' | 'service'> = {
        serviceId: parseInt(values.serviceId),
        startDate: values.startDate,
        endDate: values.endDate,
      };

      const editFormData: Partial<Omit<Booking, 'id' | 'userId' | 'hospitalId' | 'createdAt' | 'updatedAt' | 'service'>> = {
        serviceId: parseInt(values.serviceId),
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
      };

      const apiCall = booking
        ? BookingService.updateBooking(booking.id, editFormData)
        : BookingService.createBooking(createFormData);

      await apiCall
        .then(() => {
          setSubmitting(false);
          setError("");
          if (booking && setIsNewBooking) {
            setIsNewBooking(true);
          } else {
            router.push("/bookings");
          }
          onClose();
        })
        .catch(error => {
          setSubmitting(false);
          setError(error.message || 'Failed to save booking. Please try again.');
        });
    } catch (error) {
      setError("Failed to create booking. Please try again.");
      console.error("Error creating booking:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book an Appointment at {hospital?.name}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="serviceId"
                rules={{ required: "Please select a service" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name} - ${service.price}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {booking && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4 mt-[-10px]"
                        >
                          {['pending', 'confirmed', 'cancelled', 'completed'].map((status) => (
                            <div key={status} className="flex items-center space-x-2">
                              <RadioGroupItem value={status} id={status} />
                              <label htmlFor={status} className="capitalize cursor-pointer">
                                {status}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <button
                type="submit"
                disabled={submitting || isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}