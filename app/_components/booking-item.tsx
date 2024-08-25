"use client"

import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Prisma } from "@prisma/client"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "./ui/sheet"
import PhoneItem from "./phone-item"
import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { deleteBooking } from "../_actions/delete-booking"
import { toast } from "sonner"
import { useState } from "react"

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: {
        include: {
          barbershop: true
        }
      }
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const isConfirmed = isFuture(booking.date)

  const {
    service: { barbershop },
  } = booking

  const handleCancelBooking = () => {
    try {
      deleteBooking(booking.id)
      setIsSheetOpen(false)
      toast.success("Reserva cancelada com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar reserva! Tente novamente.")
    }
  }

  const handleSheetClose = (isOpen: boolean) => {
    setIsSheetOpen(isOpen)
  }

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
        <SheetTrigger className="w-full">
          <Card className="mb-4">
            <CardContent className="flex justify-between p-0">
              <div className="flex flex-col items-start gap-2 py-5 pl-5">
                <Badge
                  className="w-fit"
                  variant={isConfirmed ? "default" : "secondary"}
                >
                  {isConfirmed ? "Confirmado" : "Finalizado"}
                </Badge>
                <h3 className="font-semibold">{booking.service.name}</h3>

                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="/mcz-barb-logo-01.png"
                      alt={booking.service.barbershop.name}
                    ></AvatarImage>
                  </Avatar>
                  <p className="text-sm">{booking.service.barbershop.name}</p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                <p className="text-sm capitalize">
                  {format(booking.date, "MMMM", { locale: ptBR })}
                </p>
                <p className="text-2xl">
                  {format(booking.date, "dd", { locale: ptBR })}
                </p>
                <p className="text-sm">
                  {format(booking.date, "HH:mm", { locale: ptBR })}
                </p>
              </div>
            </CardContent>
          </Card>
        </SheetTrigger>
        <SheetContent className="w-[90%]">
          <h1 className="mb-3 border-b border-solid pb-8 text-left text-xl font-bold">
            Informações da Reserva
          </h1>
          <Card className="mt-8">
            <CardContent className="flex items-center gap-3 p-6">
              <Avatar>
                <AvatarImage
                  src="/mcz-barb-logo-01.png"
                  alt={barbershop.name}
                ></AvatarImage>
              </Avatar>
              <div className="flex flex-col">
                <h3 className="font-bold">{barbershop.name}</h3>
                <p className="text-xs">📌 {barbershop.address}</p>
              </div>
            </CardContent>
          </Card>
          <div className="mt-8">
            <Badge
              className="w-fit"
              variant={isConfirmed ? "default" : "secondary"}
            >
              {isConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>

            <div className="py-6">
              <Card>
                <CardContent className="flex flex-col items-center justify-center px-3 uppercase">
                  <div className="mt-2 flex items-center">
                    <h3 className="w-full p-1 font-semibold">
                      {booking.service.name}
                    </h3>
                    <Badge variant="outline">
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(booking.service.price))}
                    </Badge>
                  </div>
                  <p className="text-center text-sm text-gray-400">
                    {format(booking.date, "d 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}{" "}
                    às{" "}
                    <span>
                      {format(booking.date, "HH:mm", { locale: ptBR })}
                    </span>
                  </p>
                </CardContent>
              </Card>
              <div className="mt-8 space-y-4">
                {barbershop.phones.map((phone) => (
                  <PhoneItem key={phone} phone={phone} />
                ))}
              </div>
            </div>
          </div>
          <SheetFooter className="mt-6">
            <div className="flex items-center gap-3">
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  Voltar
                </Button>
              </SheetClose>
              {isConfirmed && (
                <AlertDialog>
                  <AlertDialogTrigger className="w-full">
                    <Button variant="destructive" className="w-full">
                      Cancelar reserva
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tem certeza que deseja cancelar sua reserva?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Você não poderá desfazer essa ação.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="border-none bg-red-500 hover:bg-red-600"
                        onClick={handleCancelBooking}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default BookingItem
