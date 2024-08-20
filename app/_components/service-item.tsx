"use client"

import { BarbershopService } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { useMemo, useState } from "react"
import { ptBR } from "date-fns/locale"
import { generateDayTimeList } from "../barbershops/[id]/_helpers/hours"
import { Badge } from "./ui/badge"
import { setHours, setMinutes } from "date-fns"
import { saveBooking } from "../barbershops/[id]/_actions/save-booking"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

interface ServiceItemProps {
  service: BarbershopService
}

const ServiceItem = ({ service }: ServiceItemProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string | undefined>()
  const [submitIsLoading, setSubmitIsLoading] = useState(false)

  const { data } = useSession()

  const handleDateClick = (date: Date | undefined) => {
    setDate(date)
    setHour(undefined)
  }

  const handleHourClick = (time: string) => {
    setHour(time)
  }

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true)
    try {
      if (!date || !hour || !data?.user) {
        return
      }

      const dateHour = Number(hour.split(":")[0])
      const dateMinute = Number(hour.split(":")[1])

      const newDate = setMinutes(setHours(date, dateHour), dateMinute)

      await saveBooking({
        serviceId: service.id,
        barbershopId: service.barbershopId,
        date: newDate,
        userId: (data.user as any).id,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitIsLoading(false)
    }
  }

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : []
  }, [date])

  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase">{service.name}</h3>
          <p className="text-sm text-gray-400">{service.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="secondary">
                  Reservar
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-auto p-0">
                <SheetHeader className="border-b border-solid px-5 py-6 text-left">
                  <SheetTitle>Fazer reserva</SheetTitle>
                </SheetHeader>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateClick}
                  className="mt-6"
                  locale={ptBR}
                  fromDate={new Date()}
                  styles={{
                    head_cell: {
                      width: "100%",
                      textTransform: "capitalize",
                    },
                    cell: {
                      width: "100%",
                    },
                    button: {
                      width: "100%",
                    },
                    nav_button_previous: {
                      width: "32px",
                      height: "32px",
                    },
                    nav_button_next: {
                      width: "32px",
                      height: "32px",
                    },
                    caption: {
                      textTransform: "capitalize",
                    },
                  }}
                />
                {date && (
                  <div className="mx-4 mt-4 flex flex-wrap justify-center gap-2">
                    {timeList.map((time) => (
                      <Button
                        onClick={() => handleHourClick(time)}
                        key={time}
                        variant={hour === time ? "default" : "outline"}
                        className="!m-0"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                )}

                <div className="py-6">
                  <Card className="rounded-none border-none">
                    <CardContent className="flex flex-col items-center justify-center px-3 uppercase">
                      <div className="mt-2 flex items-center">
                        <h3 className="w-full p-1 font-semibold">
                          {service.name}
                        </h3>
                        <Badge variant="outline">
                          {Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(service.price))}
                        </Badge>
                      </div>
                      <p className="mt-3 text-center text-sm text-gray-400">
                        {date
                          ? `Você selecionou o dia ${date.toLocaleDateString("pt-BR")}`
                          : "Selecione uma data"}
                      </p>
                      <p className="text-center text-sm text-gray-400">
                        {hour ? `às ${hour}` : "Selecione um horário"}
                      </p>
                      <Button
                        onClick={handleBookingSubmit}
                        disabled={!date || !hour || submitIsLoading}
                        size="lg"
                        className="mt-3 w-full"
                        variant="default"
                      >
                        {submitIsLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirmar reserva
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceItem
