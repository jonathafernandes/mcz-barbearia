import Header from "./_components/header"
import Image from "next/image"
import BookingItem from "./_components/booking-item"
import { db } from "./_lib/prisma"
import ServiceItem from "./_components/service-item"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const Home = async () => {
  const session = await getServerSession(authOptions)
  const services = await db.barbershopService.findMany()

  const booking = session?.user
    ? await db.booking.findMany({
        where: {
          userId: (session?.user as any).id,
          date: {
            gte: new Date(),
          },
        },
        include: {
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
    : []

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">
          Olá,{" "}
          {session?.user
            ? session.user.name?.split(" ")[0]
            : "seja bem-vindo(a)"}
          !
        </h2>
        {session?.user && (
          <p>
            <span className="capitalize">
              {format(new Date(), "EEEE, dd", { locale: ptBR })}
            </span>{" "}
            de{" "}
            <span className="capitalize">
              {format(new Date(), "MMMM", { locale: ptBR })}
            </span>
            .
          </p>
        )}
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            alt="Agende nos melhores com FSW Barber"
            src="/banner-01.png"
            fill
            className="rounded border border-solid border-zinc-800 object-cover"
          />
        </div>
        {session?.user && booking.length > 0 ? (
          <div>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Agendamentos
            </h2>
            {booking.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          ""
        )}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Serviços
        </h2>
        <div className="flex flex-col gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {services?.map((service) => (
            <ServiceItem key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
