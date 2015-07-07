class PlayersController < ApplicationController
	before_action :authenticate_player!

	def index
		@top_10_players = Player.includes(:scores).order("scores.points desc").last(10)
	end
end
