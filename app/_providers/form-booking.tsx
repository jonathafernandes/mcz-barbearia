"use client";

import { BarbershopService, User } from "@prisma/client";
import { useState } from "react";
import { BookingSheet } from "../_components/booking-sheet";

interface FormBookingProviderProps {
    services: BarbershopService[];
    users: User[];
}

const FormBookingProvider = ({ services, users }: FormBookingProviderProps) => {
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [showBookingSheet, setShowBookingSheet] = useState(false);

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedServiceId(e.target.value);
    };


    const selectedService = services.find((service) => service.id === selectedServiceId);

    return (
        <>
            <h1>Adicionar novo agendamento</h1>
            <select onChange={handleServiceChange}>
                <option value="">Selecione um serviço</option>
                {services.map((service) => (
                    <option key={service.id} value={service.id}>
                        {service.name}
                    </option>
                ))}
            </select>
            <select>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.name}
                    </option>
                ))}
            </select>
            {selectedService && (
                <BookingSheet
                    service={selectedService}
                    sheetIsOpen={showBookingSheet}
                    onOpenChange={setShowBookingSheet}
                />
            )}
        </>
    );
};

export default FormBookingProvider;
