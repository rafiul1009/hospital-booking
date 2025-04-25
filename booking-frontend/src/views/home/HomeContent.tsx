"use client"

import { useState, useEffect } from "react";

import HospitalCard from '@/components/cards/HospitalCard';
import ErrorMessage from '@/components/message/ErrorMessage';
import LoadingSkeleton from '@/components/skeleton/LoadingSkeleton';
import { Hospital } from "@/types";
import HospitalService from "@/services/api/hospital.service";

export default function Homepage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchHospitals = async () => {
    try {
      HospitalService.getAllHospitals()
        .then(data => {
          setIsLoading(false)
          setHospitals(data.data)
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

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Available Hospitals</h1>
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorMessage error={error} onRetry={fetchHospitals} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onBook={setSelectedHospital}
            />
          ))}
          {hospitals.length === 0 && (
            <p className="col-span-3 text-center text-gray-500">
              No hospitals available at the moment.
            </p>
          )}
        </div>
      )}

    </div>
  );
  
}
