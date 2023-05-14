from flask import request, jsonify, make_response, abort
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
        if current_user is None:
            return make_response(jsonify({"message": "A valid token is missing!"}), 401)

        return f(current_user, *args, **kwargs)
    return decorator

def raise_404_if_none(obj):
    if obj is None:
        abort(404)

def http_handlers(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            return make_response(jsonify({"message": str(e)}), 500)
    return decorator
