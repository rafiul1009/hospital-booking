/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react";
import HospitalCard from '@/components/cards/HospitalCard';
import ErrorMessage from '@/components/message/ErrorMessage';
import LoadingSkeleton from '@/components/skeleton/LoadingSkeleton';
import { HospitalFormModal } from '@/views/home/HospitalFormModal';
import { Hospital, UserState } from "@/types";
import HospitalService from "@/services/api/hospital.service";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Homepage() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNewHospital, setIsNewHospital] = useState(false);
  const [isAddHospitalOpen, setIsAddHospitalOpen] = useState(false);
  const router = useRouter();

  const user = useSelector((state: UserState) => state.auth.user)

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

  const handleAppointmentBooking = (hospital: Hospital) => {
    if (user) {
      setSelectedHospital(hospital || null);
    } else {
      router.push("/login");
    }
  }

  const handleHospitalEdit = (hospital: Hospital) => {
    if (user) {
      setSelectedHospital(hospital || null);
      setIsAddHospitalOpen(true);
    } else {
      router.push("/login");
    }
  }

  const handleHospitalDelete = async (hospital: Hospital) => {
    if (user && hospital) {
      try {
        HospitalService.deleteHospital(hospital.id).then(data => {
          setIsNewHospital(true);
        })
          .catch(error => {
            setIsNewHospital(false);
          })
      } catch (error) {
        setIsNewHospital(false);
      }
    } else {
      router.push("/login");
    }
  }

  const handleHospitalEditClose = () => {
    setIsAddHospitalOpen(false);
    setSelectedHospital(null);
  }

  useEffect(() => {
    fetchHospitals();
    if (isNewHospital) {
      fetchHospitals();
      setIsNewHospital(false);
    }
  }, [isNewHospital]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Hospitals</h1>
        {user && user.type === 'admin' &&
          <button
            onClick={() => setIsAddHospitalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md cursor-pointer"
          >
            Add Hospital
          </button>
        }
      </div>

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
              onBook={handleAppointmentBooking}
              onEdit={handleHospitalEdit}
              onDelete={handleHospitalDelete}
            />
          ))}
          {hospitals.length === 0 && (
            <p className="col-span-3 text-center text-gray-500">
              No hospitals available at the moment.
            </p>
          )}
        </div>
      )}


      {isAddHospitalOpen &&
        <HospitalFormModal
          hospital={selectedHospital}
          isOpen={isAddHospitalOpen}
          setIsNewHospital={setIsNewHospital}
          onClose={() => handleHospitalEditClose()}
        />
      }
    </div>
  );
}
