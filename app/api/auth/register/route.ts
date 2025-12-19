import prisma from "@/libs/prisma"

export async function GET() {
  const users = await prisma.user.findMany()

  return Response.json({
    randomNumber: Math.random(), users
  })
}
