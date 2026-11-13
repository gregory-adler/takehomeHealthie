# Sample data: 2 providers, 3 clients, a few journal entries.
#
#   Dr. Rivera (dietitian)  -> Sam (premium), Jordan (basic)
#   Dr. Chen (therapist)    -> Sam (basic),   Taylor (premium)
#
# Sam has two providers, on a different plan with each.

rivera = Provider.create!(name: "Dr. Maya Rivera", email: "maya.rivera@example.com")
chen   = Provider.create!(name: "Dr. Leo Chen",    email: "leo.chen@example.com")

sam    = Client.create!(name: "Sam Okafor",   email: "sam@example.com")
jordan = Client.create!(name: "Jordan Park",  email: "jordan@example.com")
taylor = Client.create!(name: "Taylor Brooks", email: "taylor@example.com")

Subscription.create!(provider: rivera, client: sam,    plan: "premium")
Subscription.create!(provider: rivera, client: jordan, plan: "basic")
Subscription.create!(provider: chen,   client: sam,    plan: "basic")
Subscription.create!(provider: chen,   client: taylor, plan: "premium")

# created_at is set by hand so the entries have different dates to sort by
JournalEntry.create!(client: sam,    body: "Oatmeal and berries for breakfast.",   created_at: 5.days.ago)
JournalEntry.create!(client: sam,    body: "Skipped lunch, felt low energy.",      created_at: 2.days.ago)
JournalEntry.create!(client: sam,    body: "Walked 30 minutes after dinner.",      created_at: 1.hour.ago)
JournalEntry.create!(client: jordan, body: "Meal-prepped lunches for the week.",   created_at: 3.days.ago)
JournalEntry.create!(client: taylor, body: "Slept 8 hours, mood much better.",     created_at: 1.day.ago)
