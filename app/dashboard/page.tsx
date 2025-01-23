import GetBookings from "../_providers/get-bookings"
import Header from "../_components/header"

import { Badge } from "../_components/ui/badge"
import { db } from "../_lib/prisma"
import { authOptions } from "../_lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"

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
      service: true,
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
          <p className="mt-32 flex justify-center">
            Nenhum agendamento para ser exibido.
          </p>
        ) : (
          <GetBookings />
        )}
      </div>
    </>
  )
}

export default DashboardPage
