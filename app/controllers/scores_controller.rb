class ScoresController < ApplicationController

	def create
		@score = Score.create(points: params[:points], player_id: current_player.id)
		json { "high score" => current_player.high_score }
	end

end
