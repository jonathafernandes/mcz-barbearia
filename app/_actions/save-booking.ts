"use server";

import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SaveBookingParams {
  barbershopId: string;
  serviceId: string;
  date: Date;
}

export const saveBooking = async (params: SaveBookingParams) => {
  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("Usuário não autenticado!");
  }

  await db.booking.create({
    data: {
      ...params,
      userId: (user.user as any).id,
    },
  });
  
  const bookingDetails = {
    name: user?.user?.name,
    date: format(params.date, "dd/MM/yyyy", { locale: ptBR }),
    time: format(params.date, "HH:mm", { locale: ptBR }),
  };

  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendTelegram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingDetails }),
    });
  } catch (error) {
    console.error("Erro ao enviar notificação no Telegram:", error);
  }

  revalidatePath("/barbershops[id]");
  revalidatePath("/bookings");
};
