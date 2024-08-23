import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Prisma } from "@prisma/client"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import PhoneItem from "./phone-item"

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
  const isConfirmed = isFuture(booking.date)

  const {
    service: { barbershop },
  } = booking

  return (
    <>
      <Sheet>
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
                      src={booking.service.barbershop.imageUrl}
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
                  src={barbershop.imageUrl}
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
        </SheetContent>
      </Sheet>
    </>
  )
}

export default BookingItem
