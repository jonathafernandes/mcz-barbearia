import { db } from "../_lib/prisma"
import PhoneItem from "./phone-item"
import { Card, CardContent } from "./ui/card"

const Footer = async () => {
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: "059c2e1c-59f6-402c-bd25-d6f3b2aff3ff",
    },
  })

  return (
    <footer>
      <Card>
        <CardContent className="flex justify-between px-5 py-6">
          <div className="space-y-6">
            <p className="text-sm text-gray-400">
              2024 Copyright{" "}
              <span className="font-bold">{barbershop?.name}</span>
            </p>
            <p className="text-sm text-gray-400">{barbershop?.address}</p>
          </div>
          <div className="space-y-3">
            {barbershop?.phones.map((phone) => (
              <div key={phone}>
                <PhoneItem phone={phone} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
