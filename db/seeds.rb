10.times { Player.create(name: Faker::Name.name, email: Faker::Internet.email, encrypted_password: Faker::Internet.password(8) }
