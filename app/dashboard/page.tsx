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

  const totalBookings = await db.booking.count()

  return (
    <>
      <Header />
      <h1 className="mb-3 p-5 text-xl font-bold">Dashboard</h1>
      <div className="flex gap-2 px-5">
        <h3>Total de agendamentos</h3>
        <Badge variant="default">{totalBookings}</Badge>
      </div>
      <div className="my-8 px-5">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="mb-4 flex rounded border border-solid uppercase"
          >
            <div className="flex w-2/6 flex-col border border-solid p-3">
              <p>
                {format(booking.date, "dd MMMM yyyy", {
                  locale: ptBR,
                })}
              </p>
              <span>{format(booking.date, "HH:mm", { locale: ptBR })}</span>
            </div>
            <p className="w-2/6 border border-solid p-3">
              {booking.service.name}
            </p>
            <p className="border border-solid p-3">{booking.user.name}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default DashboardPage
