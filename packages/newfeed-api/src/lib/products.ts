import { PrismaClient, Product } from '@prisma/client'

const prisma = new PrismaClient()

const getProducts = async function (): Promise<Product[]> {
    const products = await prisma.product.findMany() || []
    return products
}

export { getProducts }