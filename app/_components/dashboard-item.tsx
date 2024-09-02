"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Card, CardContent } from "./ui/card"
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
import { Button } from "./ui/button"
import { deleteBooking } from "../_actions/delete-booking"
import { toast } from "sonner"
import { Prisma } from "@prisma/client"

interface DashboardItemProps {
  bookings: Prisma.BookingGetPayload<{
    include: {
      user: true
      service: true
    }
  }>[]
}

const DashboardItem = ({ bookings }: DashboardItemProps) => {
  const handleCancelBooking = async (id: string) => {
    try {
      await deleteBooking(id)
      toast.success("Reserva cancelada com sucesso!")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar reserva! Tente novamente.")
    }
  }

  return (
    <>
      {bookings.map((booking) => (
        <Sheet key={booking.id}>
          <SheetTrigger className="w-full">
            <div className="mb-4 flex items-center space-x-4 rounded border border-solid p-3">
              <div className="flex flex-col">
                <p className="font-bold">
                  {format(booking.date, "dd/MM", {
                    locale: ptBR,
                  })}
                </p>
                <span>{format(booking.date, "HH:mm", { locale: ptBR })}</span>
              </div>
              <div className="flex-1 uppercase">
                <p className="border-b border-solid pb-2">
                  <span>{booking.service.name}</span>
                </p>
                <p className="pt-2">
                  <span>{booking.user.name}</span>
                </p>
              </div>
              <div className="h-20 w-20">
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img
                  src={booking.user.image ?? "Imagem não disponível"}
                  alt={booking.user.name ?? "Imagem não disponível"}
                  className="h-full w-full rounded-[2px] object-cover"
                />
              </div>
            </div>
          </SheetTrigger>
          <SheetContent className="[w-90%]">
            <h1 className="mb-3 border-b border-solid pb-8 text-left text-xl font-bold">
              Informações da Reserva
            </h1>
            <Card className="mt-8">
              <CardContent className="flex flex-col gap-6 p-6">
                <h3 className="font-semibold uppercase">
                  {booking.service.name}
                </h3>
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">
                      {format(booking.date, "dd/MM", {
                        locale: ptBR,
                      })}
                    </p>
                    <span>
                      {format(booking.date, "HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="h-20 w-20">{booking.user.name}</div>
                </div>
              </CardContent>
            </Card>
            <AlertDialog>
              <AlertDialogTrigger className="mt-10 w-full">
                <Button variant="destructive" className="w-full">
                  Cancelar reserva
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90%]">
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
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetContent>
        </Sheet>
      ))}
    </>
  )
}

export default DashboardItem
