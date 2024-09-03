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
      <div className="mb-8 p-5">
        <div className="md:flex md:items-center md:justify-around">
          <div className="mb-3">
            <h2 className="text-xl font-bold lg:text-2xl">
              Olá,{" "}
              {session?.user
                ? session.user.name?.split(" ")[0]
                : "seja bem-vindo(a)"}
              !
            </h2>
            {session?.user && (
              <p className="lg:text-xl">
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
          </div>
          <div className="relative">
            <Image
              alt="Agende nos melhores com FSW Barber"
              src="/banner-01.png"
              width={100}
              height={150}
              layout="responsive"
              className="rounded border border-solid border-zinc-800 object-cover md:border-none"
            />
          </div>
        </div>

        {session?.user && booking.length > 0 ? (
          <div>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Agendamentos
            </h2>
            {booking.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={JSON.parse(JSON.stringify(booking))}
              />
            ))}
          </div>
        ) : (
          ""
        )}
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Serviços
        </h2>
        <div className="lg:itens-center flex flex-col gap-4 overflow-auto lg:flex-row lg:flex-wrap [&::-webkit-scrollbar]:hidden">
          {services?.map((service) => (
            <ServiceItem
              key={service.id}
              service={JSON.parse(JSON.stringify(service))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
