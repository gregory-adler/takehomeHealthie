# Loads everything: gems, database connection, tables, models.
# Every script in bin/ and test/ starts by requiring this file.

require "bundler/setup"
require "active_record"
require "active_support/all" # for things like 3.days.ago

# An in-memory SQLite database. It's rebuilt from the migrations every run,
# so there's no database to install and no leftover state between runs.
# In a real app this would be Postgres, configured in database.yml.
ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")

# Set SQL=1 to print every SQL query as it runs, e.g. `SQL=1 bin/demo`
ActiveRecord::Base.logger = Logger.new($stdout) if ENV["SQL"]

# --- Build the tables by running each migration, in order ---
require_relative "../db/migrate/001_create_providers"
require_relative "../db/migrate/002_create_clients"
require_relative "../db/migrate/003_create_subscriptions"
require_relative "../db/migrate/004_create_journal_entries"

ActiveRecord::Migration.verbose = false
CreateProviders.migrate(:up)
CreateClients.migrate(:up)
CreateSubscriptions.migrate(:up)
CreateJournalEntries.migrate(:up)

# --- Load the models ---
require_relative "../app/models/provider"
require_relative "../app/models/client"
require_relative "../app/models/subscription"
require_relative "../app/models/journal_entry"
