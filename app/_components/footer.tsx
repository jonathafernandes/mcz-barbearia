import { db } from "../_lib/prisma"
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
        <CardContent className="flex flex-col justify-between px-5 py-6">
          <div className="space-y-6 text-sm text-gray-400">
            <p>
              2024 Copyright{" "}
              <span className="font-bold">{barbershop?.name}</span>
            </p>
            <div className="space-y-2">
              <p>{barbershop?.address}</p>
              <p>{barbershop?.phones}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
