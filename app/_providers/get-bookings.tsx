import { getServerSession } from "next-auth"
import { db } from "../_lib/prisma"
import { authOptions } from "../_lib/auth"
import { notFound } from "next/navigation"
import DashboardItem from "../_components/dashboard-item"

const GetBookings = async () => {
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

  return <DashboardItem bookings={bookings} />
}

export default GetBookings
