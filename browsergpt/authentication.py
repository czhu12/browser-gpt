from flask import request, jsonify, make_response
from functools import wraps
from browsergpt.models import User

def authenticated(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        # ensure the jwt-token is passed with the headers
        if 'X-ACCESS-TOKEN' in request.headers:
            token = request.headers['X-ACCESS-TOKEN']
        if not token: # throw error if no token provided
            return make_response(jsonify({"message": "A valid token is missing!"}), 401)
        current_user = User.query.filter(User.uuid == token).first()

        return f(current_user, *args, **kwargs)
    return decorator
