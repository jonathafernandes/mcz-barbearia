import Image from "next/image"
import { Button } from "./ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { signIn } from "next-auth/react"

const SignInDialog = () => {
  const handleLoginWithGoogleClick = () => signIn("google")

  return (
    <DialogContent className="w-[90%]">
      <DialogHeader>
        <DialogTitle>Faça o login na plataforma</DialogTitle>
        <DialogDescription>
          Conect-se usando sua conta do Google.
        </DialogDescription>
      </DialogHeader>
      <Button
        variant="outline"
        className="gap-1 font-bold"
        onClick={handleLoginWithGoogleClick}
      >
        <Image src="/google.svg" alt="Google" width={18} height={18} />
        Google
      </Button>
    </DialogContent>
  )
}

export default SignInDialog
