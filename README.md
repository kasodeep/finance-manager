# Finance Tracker.

## Authentication (Clerk)

- Download the `clerk` dependency.
- Add the `environment` variables to the .env files.
- Setup the middleware file and provide `clerkMiddleware`.
- Wrap the whole app with the `ClerkProvider`.
- Make sure to add the `sign-in` and `sign-up` routes.

## Routing (Hono Js)

- Hono.js is a famous web `framework` which wraps the file based api's to `express` like structure.
- Add the api routes which are being catched by the `route catcher`.
- Add the clerk dependency from the docs to `protect` the api routes.

## Database (Neon + Drizzle)

- Create a new database on neon and update the .env file with `connection` url.
- Download the dependencies `drizzle-orm`, `@neondatabase/serverless` via using the official docs.
- Download the dev dependencies like `dotenv`, `drizzle-kit`, `pg`.
- Create the `db` config and `schema`.
- Add the `migration` script to push the schema to cloud.

## Enablig RPC

- The RPC is used to co-ordinate the `schema` between neon & client.
- We need to `chain` all the routes and export them.
- We are able to achieve end to end `type safety`.
- Download `drizzle-zod` for exporting the accounts schema.
- Then use it in the `zod-validator`, for json verification.

## React Tanstack Query

- To get the `data` from the api routes to frontend.
- Wrap the whole application using the `Provider`.
- Creating different hooks for `accounts`, `transactions`.
- Using the `RPC client` provider to get the data.

## Post Api Form

- Create a state management using `zustand`.
- Create a new sheet and it's `provider`.

## Data Table

- For data table we use the shadcn tables component and `@tanstack/react-table`.
- The tables provides `filtering` and `searching` options.
- For `bulk delete` we have use the selection option.

## Drizzle Features

- Drizzle provides a great way to define relations between `entities`.
- The transactions route include a greate stuff about db `queries`.
- The queries are designed to protect the accounts/transactions of other users.

## Transaction Form

- For date we have use the `calendar` and `tooltip` from shadcn.
- For account and category, a new component is created i.e `Select`.
- This component allows to create new category/accounts directly.
- For developing this component we have used `react-select`.
- The currency input is provided by using `react-currency-input-field`

## Import CSV

- We created an enum to show different data depending on type.
- The upload button contains CSVReader to read and set the data using `react-papaparse`.
- The data is then passed to `ImportCard`, which displays the `ImportTable`.
- The `ImportTable` contains headers, body and selectedColumns.
- The components displays all the headers using `TableHeadSelect`.
- The selectedColumns contains the indexes as key used to `extract data`.

## Showing Charts

- The library used to show the charts is `recharts`.
- There are three types of graph `variants` which accepts data and shows `tooltip`.
- `DataCharts` fetches summary and then provides it to `Charts`.

## Random Stuff

- For generating random account id, we used `@paralleldrive/cuid2`.
- For converting dates to desired format, we used `date-fns`.
- For showing couting we have used `react-countup`.
- To create hashed params, we have use `query-string`
