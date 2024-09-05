"use client"

import { BarbershopService } from "@prisma/client"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { useState } from "react"
import { Dialog } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import { BookingSheet } from "./booking-sheet"

interface ServiceItemProps {
  service: BarbershopService
}

const ServiceItem = ({ service }: ServiceItemProps) => {
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [sheetIsOpen, setSheetIsOpen] = useState(false)

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3 lg:w-[400px]">
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              className="rounded-lg object-cover border border-solid border-gray-200"
            />
          </div>
          <div className="w-full space-y-2">
            <h3 className="text-sm font-semibold uppercase">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <BookingSheet
                service={service}
                sheetIsOpen={sheetIsOpen}
                onOpenChange={(open) => setSheetIsOpen(open)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <SignInDialog />
      </Dialog>
    </>
  )
}

export default ServiceItem
