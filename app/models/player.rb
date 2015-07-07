class Player < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :scores

  validates :email, format: { with: /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+{2,}\z/}
  validates :email, uniqueness: true, presence: true
  validates :name, uniqueness: true, presence: true
  validates :encrypted_password, length: { minimum: 5 }, presence: true

  def high_score
  	self.scores.maximum(:points)
  end
  
end
