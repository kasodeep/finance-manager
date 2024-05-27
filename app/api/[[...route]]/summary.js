import { Hono } from 'hono'
import { z } from 'zod'
import { and, desc, eq, gte, lt, lte, sql, sum } from 'drizzle-orm'
import { differenceInDays, parse, subDays, addDays } from 'date-fns'

import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

import { db } from '@/db/drizzle'
import { transactions, accounts, categories } from '@/db/schema'
import { calculatePercentageChange, fillMissingDays } from '@/lib/utils'

const app = new Hono()
   .get("/",
      clerkMiddleware(),
      zValidator("query", z.object({
         from: z.string().optional(),
         to: z.string().optional(),
         accountId: z.string().optional()
      })),
      async (c) => {
         const auth = getAuth(c)
         const { from, to, accountId } = c.req.valid("query")

         // unauthorized.
         if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401)
         }

         const defaultTo = new Date()
         const defaultFrom = subDays(defaultTo, 30)

         const startDate = from ? subDays(parse(from, "yyyy-MM-dd", new Date()), 1) : defaultFrom
         const endDate = to ? addDays(parse(to, "yyyy-MM-dd", new Date()), 1) : defaultTo

         const periodLength = differenceInDays(endDate, startDate) + 1
         const lastPeriodStart = subDays(startDate, periodLength)
         const lastPeriodEnd = subDays(endDate, periodLength)

         // getting financial data for last two periods.
         const [currentPeriod] = await fetchFinancialData(auth.userId, startDate, endDate, accountId)
         const [lastPeriod] = await fetchFinancialData(auth.userId, lastPeriodStart, lastPeriodEnd, accountId)

         // calculating percentage change.
         const incomeChange = calculatePercentageChange(currentPeriod.income, lastPeriod.income)
         const expensesChange = calculatePercentageChange(currentPeriod.expenses, lastPeriod.expenses)
         const remainingChange = calculatePercentageChange(currentPeriod.remaining, lastPeriod.remaining)

         // group by category to return most used category.
         const category = await db
            .select({
               name: categories.name,
               amount: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .innerJoin(categories, eq(transactions.categoryId, categories.id))
            .where(
               and(
                  accountId ? eq(transactions.accountId, accountId) : undefined,
                  eq(accounts.userId, auth.userId),
                  lt(transactions.amount, 0),
                  gte(transactions.date, startDate),
                  lte(transactions.date, endDate)
               )
            )
            .groupBy(categories.name)
            .orderBy(desc(
               sql`SUM(ABS(${transactions.amount}))`.mapWith(Number)
            ))

         // getting top and other categories.
         const topCategories = category.slice(0, 3)
         const otherCategories = category.slice(3)

         const otherSum = otherCategories.reduce((sum, current) => sum + current.amount, 0)
         const finalCategories = topCategories

         if (otherCategories.length > 0) {
            finalCategories.push({ name: "Other", amount: otherSum })
         }

         const activeDays = await db
            .select({
               date: transactions.date,
               income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
               expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(Number),
            })
            .from(transactions)
            .innerJoin(accounts, eq(transactions.accountId, accounts.id))
            .where(
               and(
                  accountId ? eq(transactions.accountId, accountId) : undefined,
                  eq(accounts.userId, auth.userId),
                  gte(transactions.date, startDate),
                  lte(transactions.date, endDate)
               )
            )
            .groupBy(transactions.date)
            .orderBy(transactions.date)

         // filling the empty days.
         const days = fillMissingDays(activeDays, startDate, endDate)

         return c.json({
            data: {
               remainingAmount: currentPeriod.remaining,
               remainingChange,
               incomeAmount: currentPeriod.income,
               incomeChange,
               expensesAmount: currentPeriod.expenses,
               expensesChange,
               categories: finalCategories,
               days
            }
         })
      })

async function fetchFinancialData(userId, startDate, endDate, accountId) {
   return await db
      .select({
         income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
         expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
         remaining: sum(transactions.amount).mapWith(Number)
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
         and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
         )
      )
}

export default app