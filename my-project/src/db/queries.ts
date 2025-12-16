import { db } from "./index"
import { wishes } from "./schema"
import { eq, desc } from "drizzle-orm"

export function listWishes() {
  return db.select().from(wishes).orderBy(desc(wishes.id))
}

export async function createWish(item: string) {
  const createdAt = Math.floor(Date.now() / 1000)

  const res = await db.insert(wishes).values({
    item,
    fulfilled: 0,
    createdAt,
  }).returning()

  return { id: res[0].id }
}

export async function fulfillWish(id: number) {
  const res = await db.update(wishes)
    .set({ fulfilled: 1 })
    .where(eq(wishes.id, id))
    .run()

  // better-sqlite3's run() returns { changes: number }
  // drizzle passthrough before .all()/.get(), so res has .changes
  // TypeScript thinks run() is void; we rely on runtime shape and cast.
  return { changes: (res as any).changes ?? 0 }
}

export async function deleteWish(id: number) {
  const res = await db.delete(wishes).where(eq(wishes.id, id)).run()
  return { changes: (res as any).changes ?? 0 }
}