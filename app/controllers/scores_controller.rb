class ScoresController < ApplicationController
skip_before_action :verify_authenticity_token
 
	def create
		@score = Score.create(points: params[:points], player_id: current_player.id)
		render :json => [current_player.high_score, current_player.scores.last.points]
	end

end
