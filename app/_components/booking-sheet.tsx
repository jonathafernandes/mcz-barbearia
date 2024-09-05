"use client"

import { BarbershopService, Booking } from "@prisma/client"
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
import { useEffect, useMemo, useState } from "react"
import { ptBR } from "date-fns/locale"
import { generateDayTimeList } from "../_helpers/hours"
import { Badge } from "./ui/badge"
import { setHours, setMinutes, format, isPast, set } from "date-fns"
import { saveBooking } from "../_actions/save-booking"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getDayBookings } from "../_actions/get-day-bookings"

interface BookingSheetProps {
    service: BarbershopService
    sheetIsOpen: boolean
    onOpenChange: (open: boolean) => void
}

export const BookingSheet = ({ service, sheetIsOpen, onOpenChange }: BookingSheetProps) => {
    const router = useRouter()

    const [date, setDate] = useState<Date | undefined>(undefined)
    const [hour, setHour] = useState<string | undefined>()
    const [submitIsLoading, setSubmitIsLoading] = useState(false)
    const [dayBookings, setDayBookings] = useState<Booking[]>([])

    const { data } = useSession()

    useEffect(() => {
        if (!date) {
            return
        }

        const refreshAvailableHours = async () => {
            const _dayBookings = await getDayBookings(date)
            setDayBookings(_dayBookings)
        }

        refreshAvailableHours()
    }, [date])

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
            })

            onOpenChange(false)
            setDate(undefined)
            setHour(undefined)
            toast("Reserva realizada com sucesso!", {
                description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
                    locale: ptBR,
                }),
                action: {
                    label: "Visualizar",
                    onClick: () => router.push("/bookings"),
                },
            })
        } catch (error) {
            console.error(error)
            toast("Ocorreu um erro ao realizar a reserva!")
        } finally {
            setSubmitIsLoading(false)
        }
    }

    const timeList = useMemo(() => {
        if (!date) {
            return []
        }

        const isToday =
            format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")

        return generateDayTimeList(date).filter((time) => {
            const timeHour = Number(time.split(":")[0])
            const timeMinutes = Number(time.split(":")[1])

            if (
                isToday &&
                isPast(set(new Date(), { hours: timeHour, minutes: timeMinutes }))
            ) {
                return false
            }

            const booking = dayBookings.find((booking) => {
                const bookingHour = booking.date.getHours()
                const bookingMinutes = booking.date.getMinutes()

                return bookingHour === timeHour && bookingMinutes === timeMinutes
            })

            if (!booking) {
                return true
            }

            return false
        })
    }, [date, dayBookings])

    return (
        <Sheet open={sheetIsOpen} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onOpenChange(true)}
                >
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
                    className=""
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
                        {timeList.length > 0 ? (
                            timeList.map((time) => (
                                <Button
                                    onClick={() => handleHourClick(time)}
                                    key={time}
                                    variant={hour === time ? "default" : "outline"}
                                    className="!m-0"
                                >
                                    {time}
                                </Button>
                            ))
                        ) : (
                            <p className="text-center text-sm text-gray-400">
                                Nenhum horário disponível
                            </p>
                        )}
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
    )
}
