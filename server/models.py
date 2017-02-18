from app import db

class Algorithms(db.Model):
    __tablename__ = "algorithms"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    def __init__(self, id, name):
        self.id = id
        self.name = name

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }
