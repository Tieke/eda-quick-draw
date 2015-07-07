FactoryGirl.define do
  factory :score do
    points { rand(10..100) }
		player nil
  end

end
