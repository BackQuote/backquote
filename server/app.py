#!/usr/bin/env python
from flask import Flask, jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from models import *

db = SQLAlchemy(app)
api = Api(app)

@app.route('/')
def api_root():
    return '<h1>BackQuote API</h1>'

@app.route('/algorithms')
def algorithms():
    algos = Algorithms.query.all()
    return jsonify([i.serialize for i in algos])

@app.route('/algorithms/<id>')
def algorithm(id):
    # TODO: Handle errors
    algo = Algorithms.query.get(id)
    return jsonify(algo.serialize)

class Status(Resource):
    def get(self):
        return {'status' : 'ok'}

api.add_resource(Status, '/status')

if __name__ == '__main__':
    app.run(debug=True)