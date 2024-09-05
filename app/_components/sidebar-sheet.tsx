"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import {
  Bolt,
  CalendarCheck,
  CalendarIcon,
  HomeIcon,
  LogOutIcon,
} from "lucide-react"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Avatar, AvatarImage } from "./ui/avatar"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Dialog, DialogTrigger } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import { getUsers } from "../_actions/get-users"

const SidebarSheet = () => {
  const { data } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      if (data?.user?.email) {
        const users = await getUsers()
        const currentUser = users.find(
          (user) => user.email === data.user?.email,
        )

        if (currentUser) {
          setIsAdmin(currentUser?.isAdmin ?? false)
        }
      }
    }

    fetchUser()
  }, [data])

  const handleLogoutClick = () => signOut()

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        {data?.user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={data?.user?.image ?? ""}
                alt={data?.user?.name ?? ""}
              />
            </Avatar>
            <div>
              <p className="font-bold">{data?.user?.name}</p>
              <p className="text-xs">{data?.user?.email}</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="">Olá, faça seu login!</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon">
                  <LogOutIcon size={18} />
                </Button>
              </DialogTrigger>
              <SignInDialog />
            </Dialog>
          </>
        )}
      </div>
      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/">
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>
        </SheetClose>

        {data?.user && (
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/bookings">
              <CalendarIcon size={18} />
              Meus agendamentos
            </Link>
          </Button>
        )}

        {isAdmin && (
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/dashboard">
              <CalendarCheck size={18} />
              Todos agendamentos
            </Link>
          </Button>
        )}

        {isAdmin && (
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/manage-bookings">
              <Bolt size={18} />
              Gerenciar agendamentos
            </Link>
          </Button>
        )}
      </div>
      {data?.user && (
        <div className="flex flex-col gap-2 py-5">
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={handleLogoutClick}
          >
            <LogOutIcon size={18} />
            Sair da conta
          </Button>
        </div>
      )}
    </SheetContent>
  )
}

export default SidebarSheet
