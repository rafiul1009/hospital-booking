/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import HospitalService from "@/services/api/hospital.service";
import { Hospital } from "@/types";

interface Service {
  name: string;
  description: string;
  price: string;
}

interface HospitalFormModalProps {
  hospital?: Hospital | null;
  isOpen: boolean;
  onClose: () => void;
  setIsNewHospital: (value: boolean) => void;
}

export function HospitalFormModal({ hospital, isOpen, onClose, setIsNewHospital }: HospitalFormModalProps) {
  const [hospitalName, setHospitalName] = useState(hospital?.name || "");
  const [services, setServices] = useState<Service[]>(
    hospital?.services?.map(s => ({
      name: s.name,
      description: s.description,
      price: s.price.toString()
    })) || [{ name: "", description: "", price: "" }]
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddService = () => {
    setServices([...services, { name: "", description: "", price: "" }]);
  };

  const handleRemoveService = (index: number) => {
    if (services.length > 1) {
      const newServices = services.filter((_, i) => i !== index);
      setServices(newServices);
    }
  };

  console.log("hospital", hospital);
  

  const handleServiceChange = (index: number, field: keyof Service, value: string) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    setServices(newServices);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!hospitalName.trim()) {
      newErrors.hospitalName = "Hospital name is required";
    }

    services.forEach((service, index) => {
      if (!service.name.trim()) {
        newErrors[`service_${index}_name`] = "Service name is required";
      }
      if (!service.description.trim()) {
        newErrors[`service_${index}_description`] = "Description is required";
      }
      if (!service.price.trim()) {
        newErrors[`service_${index}_price`] = "Price is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // TODO: Implement API call to save hospital
    const formData = {
      name: hospitalName,
      services: services.map(service => ({
        ...service,
        price: parseFloat(service.price)
      }))
    };

    try {
      setIsSubmitting(true);
      const apiCall = hospital
        ? HospitalService.updateHospital(hospital.id, formData)
        : HospitalService.createHospital(formData);      
      apiCall
        .then(data => {
          setIsSubmitting(false)
          setHospitalName("");
          setServices([{ name: "", description: "", price: "" }]);
          setErrors({});
          setIsNewHospital(true);
          onClose();
        })
        .catch(error => {
          setIsSubmitting(false)
          setIsNewHospital(false);
          setErrors(error.message || 'Login failed. Please try again.');
        })
    } catch (error) {
      console.log(error);
      setIsNewHospital(false);
      setIsSubmitting(false);
    }

  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{hospital ? 'Edit Hospital' : 'Add Hospital'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="hospitalName">Hospital Name</Label>
            <Input
              id="hospitalName"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="Enter hospital name"
              className={errors.hospitalName ? "border-red-500" : ""}
            />
            {errors.hospitalName && (
              <p className="text-sm text-red-500">{errors.hospitalName}</p>
            )}
          </div>

          <div className="space-y-4">
            <Label>Services</Label>
            {services.map((service, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                {services.length > 1 && (
                  <button
                    onClick={() => handleRemoveService(index)}
                    className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      value={service.name}
                      onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                      placeholder="Service name"
                      className={errors[`service_${index}_name`] ? "border-red-500" : ""}
                    />
                    {errors[`service_${index}_name`] && (
                      <p className="text-sm text-red-500">{errors[`service_${index}_name`]}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      value={service.price}
                      onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                      placeholder="Price"
                      type="number"
                      min={0}
                      className={errors[`service_${index}_price`] ? "border-red-500" : ""}
                    />
                    {errors[`service_${index}_price`] && (
                      <p className="text-sm text-red-500">{errors[`service_${index}_price`]}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Input
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                      placeholder="Description"
                      className={errors[`service_${index}_description`] ? "border-red-500" : ""}
                    />
                    {errors[`service_${index}_description`] && (
                      <p className="text-sm text-red-500">{errors[`service_${index}_description`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddService}
              className="w-full py-2 border-2 border-dashed rounded-lg hover:bg-gray-50"
            >
              Add Service
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}