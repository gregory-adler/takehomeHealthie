class Client < ActiveRecord::Base
  has_many :subscriptions, dependent: :destroy
  has_many :providers, through: :subscriptions
  has_many :journal_entries, dependent: :destroy

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :name, presence: true
  validates :email, presence: true,
                    uniqueness: true,
                    format: { with: URI::MailTo::EMAIL_REGEXP }

  # Which plan is this client on with a given provider? ("basic", "premium", or nil)
  def plan_with(provider)
    subscriptions.find_by(provider: provider)&.plan
  end
end
