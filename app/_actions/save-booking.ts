"use server"

import { authOptions } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { getServerSession } from "next-auth"

interface SaveBookingParams {
  barbershopId: string
  serviceId: string
  date: Date
}

export const saveBooking = async (params: SaveBookingParams) => {
  const user = await getServerSession(authOptions)

  if (!user) {
    throw new Error("Usuário não autenticado!")
  }

  await db.booking.create({
    data: {
      ...params,
      userId: (user.user as any).id,
    },
  })
}
