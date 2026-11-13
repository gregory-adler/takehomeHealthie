# One client signed up with one provider, on one plan.
class Subscription < ActiveRecord::Base
  belongs_to :provider
  belongs_to :client

  # Gives us subscription.premium?, subscription.basic!, Subscription.premium, etc.
  # validate: true means a bad value like "gold" fails validation
  # instead of raising an error.
  enum :plan, { basic: "basic", premium: "premium" }, validate: true

  validates :client_id, uniqueness: {
    scope: :provider_id,
    message: "is already signed up with this provider"
  }
end
