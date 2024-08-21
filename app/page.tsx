import Header from "./_components/header"
import Image from "next/image"
import BookingItem from "./_components/booking-item"
import { db } from "./_lib/prisma"
import ServiceItem from "./_components/service-item"

const Home = async () => {
  const services = await db.barbershopService.findMany()

  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, João!</h2>
        <p>Segunda-feira, 05 de agosto.</p>
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            alt="Agende nos melhores com FSW Barber"
            src="/banner-01.png"
            fill
            className="rounded object-cover"
          />
        </div>
        <BookingItem />
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
