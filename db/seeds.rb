Player.destroy_all

10.times do 
	player = Player.create(name: Faker::Name.name, email: Faker::Internet.email, password: Faker::Internet.password(8))
	10.times {player.scores << Score.create(points: rand(10..100))}
end
