import { MapPin, Phone } from "lucide-react"
import { db } from "../_lib/prisma"
import { Card, CardContent } from "./ui/card"

const Footer = async () => {
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: "059c2e1c-59f6-402c-bd25-d6f3b2aff3ff",
    },
  })

  const url = `https://api.whatsapp.com/send?phone=${barbershop?.phones}`

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
              <div className="flex gap-2">
                <MapPin size={16} />
                <p>{barbershop?.address}</p>
              </div>
              <div className="flex gap-2">
                <Phone size={16} />
                <a href={url} target="_blank">
                  {barbershop?.phones}
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
