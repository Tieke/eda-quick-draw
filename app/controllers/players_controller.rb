class PlayersController < ApplicationController
	before_action :authenticate_player!

	def index
		# @top_10_players = Player.joins(:scores).order("scores.points desc").to_a.uniq {|player| player.name}.first(10)
		@top_10_players = Player.joins(:scores).order("scores.points desc").pluck(:name, :points).uniq{|player| player[0]}
	end
end
