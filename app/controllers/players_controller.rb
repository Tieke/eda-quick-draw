class PlayersController < ApplicationController
	before_action :authenticate_player!

	def index
		@top_10_players = Player.joins(:scores).order("scores.points desc").pluck(:name, :points).uniq{|player| player[0]}.first(10)
		if current_player.scores.any?
			last_score = current_player.scores.last.points 
			high_score = current_player.high_score 
			@message = [last_score, high_score]
		end
	end
end
