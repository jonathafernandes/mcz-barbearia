"use client"

import { SmartphoneIcon } from "lucide-react"
import { Button } from "./ui/button"
import { toast } from "sonner"

interface PhoneItemProps {
  phone: string
}

const PhoneItem = ({ phone }: PhoneItemProps) => {
  const handleCopyPhoneClick = (phone: string) => {
    navigator.clipboard.writeText(phone)
    toast.success("Telefone copiado para a área de transferência")
  }

  return (
    <div className="flex justify-between space-y-3">
      <div className="flex items-center gap-2">
        <SmartphoneIcon size={16} />
        <p className="text-sm">{phone}</p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleCopyPhoneClick(phone)}
      >
        Copiar
      </Button>
    </div>
  )
}

export default PhoneItem
