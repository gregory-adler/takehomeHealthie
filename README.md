# Healthie Pairing Interview Pre-Work

Two parts:

- **`data-model/`**: providers, clients, plans, and journal entries in ActiveRecord
- **`kanban/`**: a React + TypeScript Kanban board with Rick and Morty characters

---

## Part 1: Data model (`data-model/`)

### Run it

Needs Ruby 3.2 or newer (`ruby -v`).

```bash
cd data-model
bundle install

ruby test/models_test.rb   # run the tests
bin/demo                   # run the 4 queries and print results + SQL
bin/console                # interactive prompt with models and seed data loaded
```

Add `SQL=1` to any command to log every SQL query as it runs, e.g. `SQL=1 bin/demo`.

### Schema

```
providers         clients
  name              name
  email (unique)    email (unique)
      \             /
       subscriptions
         provider_id
         client_id
         plan ("basic" | "premium")
         unique on (provider_id, client_id)

journal_entries
  client_id
  body (text)
  created_at
  index on (client_id, created_at)
```

### The 4 queries

| Query | Code |
|---|---|
| All clients for a provider | `provider.clients` |
| All providers for a client | `client.providers` |
| A client's journal entries, by date | `client.journal_entries.newest_first` |
| Journal entries across all of a provider's clients, by date | `provider.journal_entries.newest_first` |

All 4 come from associations in `app/models/`. `newest_first` is a scope on `JournalEntry`.

### Decisions and tradeoffs

- **The plan lives on the join table.** A plan describes a client's relationship with one provider, not the client or the provider on their own. Sam can be premium with one provider and basic with another. So the join table is a real model (`Subscription`) and not a bare `has_and_belongs_to_many`.
- **Providers and clients are separate tables**, even though both have a name and email. They're different roles with different relationships, and they'll grow different fields. The cost is that one person can't be both a provider and a client under one login. If that came up, I'd add a shared `users` table for identity, with provider and client profiles pointing at it.
- **Constraints are in the database as well as the models.** `null: false`, unique indexes, and foreign keys back up the validations, because two requests at the same moment can both pass a model validation.
- **Sorting uses `created_at`.** That's fine if an entry is always written on the day it describes. If clients can backfill ("log what I ate yesterday"), I'd add an `entry_date` column and sort by that.
- **`id` breaks ties in the sort**, so the order is stable. That matters once results are paginated.
- **Standalone ActiveRecord instead of a full Rails app**, to keep the focus on the data model. The migrations and models would drop into a Rails app unchanged. It uses in-memory SQLite, rebuilt every run, so there's nothing to install. In production this would be Postgres.

### At scale

- The indexes match the queries: `(client_id, created_at)` serves both journal queries, and `(provider_id, client_id)` serves provider lookups.
- Paginate with a cursor (`WHERE (created_at, id) < (last_seen_created_at, last_seen_id)`) rather than `OFFSET`, which gets slower the deeper you page.
- Use `includes` to avoid N+1 queries when showing related records (see `bin/demo`).
- The provider-wide feed joins through subscriptions and clients. For a provider with thousands of clients, I'd look at the query plan first. If needed, options include a cached or denormalized feed table, or a read replica.

---

## Part 2: Kanban board (`kanban/`)

### Run it

Needs Node 20 or newer.

```bash
cd kanban
npm install
npm run dev    # open the URL it prints
npm test       # reducer tests
```

### How it's organized

```
src/
  App.tsx                 holds board state, wires everything together
  types.ts                Character, Item, BoardState, column list
  api/
    rickAndMorty.ts       GraphQL request with plain fetch
    useCharacters.ts      hook: characters + loading + error
  state/
    boardReducer.ts       every board change (add, move) in one place
    boardReducer.test.ts
  components/
    NewItemForm.tsx       title + character picker
    Board.tsx             drag-and-drop context; turns a drop into a move
    Column.tsx            one droppable column
    ItemCard.tsx          one draggable card
  celebrate.ts            confetti when a card lands in Done
```

### Decisions and tradeoffs

- **State is `items` by id, plus an ordered list of ids per column.** An item's column is its status and its position in the list is its order, so moving and reordering are the same operation. An alternative is a `status` and `position` on each item, which is closer to a database shape but makes reordering fiddlier.
- **One reducer handles every change.** This makes the logic easy to test without rendering anything, and it gives one obvious place for persistence, undo, or syncing to a server later.
- **`@hello-pangea/dnd` for drag and drop.** It's the maintained fork of Atlassian's `react-beautiful-dnd`, built for list and column UIs like this one, and it supports keyboard dragging out of the box (focus a card, Space, arrow keys, Space). `dnd-kit` is more flexible but needs more setup for the same result.
- **Plain `fetch` for GraphQL instead of Apollo.** For one query, a client library would add more than it saves. With many queries, caching, or mutations, I'd reach for one.
- **Each item stores a copy of its character** rather than only the id, so a card renders on its own and survives a reload once there's persistence.
- **The board only uses the first page of characters (20).** A searchable picker using the API's `filter: { name }` argument would be the next step.

### Not done yet

- Persistence (a `useEffect` that saves board state to `localStorage` would be the simplest version)
- Filtering, editing, and deleting cards
- Searching or paging through more characters
