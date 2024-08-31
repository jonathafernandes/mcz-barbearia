import { getServerSession } from "next-auth"
import Header from "../_components/header"
import { db } from "../_lib/prisma"
import { authOptions } from "../_lib/auth"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "../_components/ui/badge"

const DashboardPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return notFound()
  }

  const bookings = await db.booking.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    include: {
      user: true,
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  const totalBookings = bookings.length

  return (
    <>
      <Header />
      <h1 className="mb-3 p-5 text-xl font-bold">Dashboard</h1>
      <div className="flex gap-2 px-5">
        <h3>Total de agendamentos</h3>
        <Badge variant="default">{totalBookings}</Badge>
      </div>
      <div className="my-8 px-5">
        {bookings.length === 0 ? (
          <p className="mt-[50%] flex justify-center">
            Nenhum agendamento para ser exibido.
          </p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="mb-4 flex items-center space-x-4 rounded border border-solid p-3"
            >
              <div className="flex flex-col">
                <p className="font-bold">
                  {format(booking.date, "dd/MM/yyyy", {
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
          ))
        )}
      </div>
    </>
  )
}

export default DashboardPage
