Rails.application.routes.draw do
  devise_for :players
  root to: "welcome#index"

  resources :players, except: [ :update, :edit, :destroy ] do
    resources :scores, only: [ :index, :create ]
  end

  
end
