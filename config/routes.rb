Rails.application.routes.draw do
  devise_for :players, :path => '', :controllers => {:registrations => "registrations"}
  root to: "players#index"

  resources :players, except: [ :update, :edit, :destroy ] do
    resources :scores, only: [ :index ]
  end

  post '/scores', to: 'scores#create', as: 'score'
  get '/games', to: 'games#show', as: 'game'
  
end
