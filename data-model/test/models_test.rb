# Run with: ruby test/models_test.rb

require_relative "../config/environment"
require "minitest/autorun"

class ModelsTest < Minitest::Test
  # Each test builds its own small dataset, and teardown wipes it,
  # so tests don't depend on each other or on db/seeds.rb.
  def setup
    @rivera = Provider.create!(name: "Dr. Rivera", email: "rivera@example.com")
    @chen   = Provider.create!(name: "Dr. Chen",   email: "chen@example.com")

    @sam    = Client.create!(name: "Sam",    email: "sam@example.com")
    @jordan = Client.create!(name: "Jordan", email: "jordan@example.com")
    @taylor = Client.create!(name: "Taylor", email: "taylor@example.com")

    Subscription.create!(provider: @rivera, client: @sam,    plan: "premium")
    Subscription.create!(provider: @rivera, client: @jordan, plan: "basic")
    Subscription.create!(provider: @chen,   client: @sam,    plan: "basic")
    Subscription.create!(provider: @chen,   client: @taylor, plan: "premium")
  end

  def teardown
    # Children before parents, so foreign keys don't complain
    JournalEntry.delete_all
    Subscription.delete_all
    Client.delete_all
    Provider.delete_all
  end

  # --- The 4 required queries ---

  def test_all_clients_for_a_provider
    assert_equal ["Jordan", "Sam"], @rivera.clients.map(&:name).sort
  end

  def test_all_providers_for_a_client
    assert_equal ["Dr. Chen", "Dr. Rivera"], @sam.providers.map(&:name).sort
  end

  def test_journal_entries_for_a_client_newest_first
    old_entry = JournalEntry.create!(client: @sam, body: "old", created_at: 3.days.ago)
    new_entry = JournalEntry.create!(client: @sam, body: "new", created_at: 1.day.ago)
    JournalEntry.create!(client: @jordan, body: "not Sam's")

    assert_equal [new_entry, old_entry], @sam.journal_entries.newest_first.to_a
  end

  def test_journal_entries_across_a_providers_clients_newest_first
    sam_entry    = JournalEntry.create!(client: @sam,    body: "sam",    created_at: 2.days.ago)
    jordan_entry = JournalEntry.create!(client: @jordan, body: "jordan", created_at: 1.day.ago)
    JournalEntry.create!(client: @taylor, body: "Taylor is Dr. Chen's client, not Dr. Rivera's")

    assert_equal [jordan_entry, sam_entry], @rivera.journal_entries.newest_first.to_a
  end

  # --- Plans ---

  def test_a_client_can_have_a_different_plan_with_each_provider
    assert_equal "premium", @sam.plan_with(@rivera)
    assert_equal "basic", @sam.plan_with(@chen)
  end

  def test_plan_must_be_basic_or_premium
    subscription = Subscription.new(provider: @chen, client: @jordan, plan: "gold")

    refute subscription.valid?
    assert_includes subscription.errors[:plan], "is not included in the list"
  end

  def test_client_cannot_sign_up_with_the_same_provider_twice
    duplicate = Subscription.new(provider: @rivera, client: @sam, plan: "basic")

    refute duplicate.valid?
    assert_includes duplicate.errors[:client_id], "is already signed up with this provider"
  end

  # --- Validations ---

  def test_email_is_normalized_and_unique
    client = Client.create!(name: "Casey", email: "  Casey@Example.COM ")
    assert_equal "casey@example.com", client.email

    duplicate = Client.new(name: "Other Casey", email: "casey@example.com")
    refute duplicate.valid?
  end

  def test_journal_entry_needs_a_body
    refute JournalEntry.new(client: @sam, body: "").valid?
  end
end
