"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Hospital, UserState } from "@/types";
import { useSelector } from "react-redux";

interface HospitalCardProps {
  hospital: Hospital;
  onBook: (hospital: Hospital) => void
  onEdit: (hospital: Hospital) => void
  onDelete: (hospital: Hospital) => void
}

export default function HospitalCard({ hospital, onBook, onEdit, onDelete }: HospitalCardProps) {

  const user = useSelector((state: UserState) => state.auth.user)

  return (
    <Card className="hover:shadow-lg transition-shadow">

      <CardContent>
        <CardTitle>{hospital.name}</CardTitle>
        <CardDescription>
          <div className="font-semibold mb-2 border-b border-gray-300 pb-1 mt-4">Services:</div>
          <ul>
            {hospital.services.map((service, index) => {
              return <li key={index} className="mb-2 flex justify-between">
                <span>{service.name}</span>
                <span>${service.price.toFixed(2)}</span>
              </li>;
            })}
          </ul>
        </CardDescription>
      </CardContent>
      <CardContent>
        <button
          onClick={() => onBook(hospital)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md mt-2 cursor-pointer"
        >
          Book Appointment
        </button>
        {user && user.type === 'admin' &&
          <button
            onClick={() => onEdit(hospital)}
            className="w-full bg-sky-800 text-white hover:bg-sky-800/90 px-4 py-2 rounded-md mt-2 cursor-pointer"
          >
            Edit
          </button>}
        {user && user.type === 'admin' &&
          <button
            onClick={() => onDelete(hospital)}
            className="w-full bg-red-800 text-white hover:bg-red-800/90 px-4 py-2 rounded-md mt-2 cursor-pointer"
          >
            Delete
          </button>}
      </CardContent>
    </Card>
  );
}
