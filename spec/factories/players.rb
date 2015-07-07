FactoryGirl.define do
  factory :player do
    name Faker::Name.name
    email Faker::Internet.email
    password Faker::Internet.password(6,12)
  end

end
