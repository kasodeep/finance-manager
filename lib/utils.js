import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function convertAmountToMiliunits(amount) {
  return Math.round(amount * 1000)
}

export function convertAmountFromMiliunits(amount) {
  return amount / 1000
}

export function formatCurrency(value) {
  return Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, }).format(value)
}

export function calculatePercentageChange(current, previous) {
  if (previous === 0) return previous === current ? 0 : 100
  return ((current - previous) / previous) * 100
}

export function fillMissingDays(activeDays, startDate, endDate) {
  if (activeDays.length === 0) return []

  const allDays = eachDayOfInterval({ start: startDate, end: endDate })

  const transactionsByDays = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day))

    if (found) {
      return {
        ...found,
        date: format(found.date, 'yyyy-MM-dd')
      };
    } else {
      return {
        date: format(day, 'yyyy-MM-dd'),
        income: 0,
        expenses: 0
      };
    }
  })

  return transactionsByDays
}

export function formatDateRange(period) {
  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 30)

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`
  }
  if (period?.to) {
    return `${format(period.from, "LLL dd")} - ${format(period.to, "LLL dd, y")}`
  }

  return format(period.from, "LLL dd, y")
}

export function formatPercentage(value, options = { addPrefix: false }) {
  const result = new Intl.NumberFormat("en-IN", {
    style: "percent",
  }).format(value / 100)

  if (options.addPrefix && value >= 0) {
    return `+${result}`
  }
  return result
}