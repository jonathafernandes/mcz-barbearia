"use server"

import { db } from "../_lib/prisma"

export const getUsers = async () => {
  const users = await db.user.findMany()

  return users
}
