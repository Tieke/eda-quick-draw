class PlayersController < ApplicationController
	before_action :authenticate_player!

	def index
		@top_10_players = Player.joins(:scores).order("scores.points desc").pluck(:name, :points).uniq{|player| player[0]}.first(10)
		last_score = current_player.scores.last.points || 0
		high_score = current_player.high_score || 0
		@message = [last_score, high_score]
	end
end
