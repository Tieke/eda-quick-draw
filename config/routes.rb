Rails.application.routes.draw do
  devise_for :players
  root to: "welcome#index"

  
end
