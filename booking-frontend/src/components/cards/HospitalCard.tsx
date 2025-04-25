"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital } from "@/types";

export default function HospitalCard({ hospital, onBook }: { hospital: Hospital; onBook: (hospital: Hospital) => void }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{hospital.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <div className="font-semibold mb-2 border-b border-gray-300 pb-1">Services:</div>
          <ul>
            {hospital.services.map((service, index) => {
              return <li key={index} className="mb-2 flex justify-between">
                <span>{service.name}</span>
                <span>${service.price.toFixed(2)}</span>
              </li>;
            })}
          </ul>
        </CardDescription>
        <button
          onClick={() => onBook(hospital)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md mt-2"
        >
          Book Appointment
        </button>
      </CardContent>
    </Card>
  );
}
