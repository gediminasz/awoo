from functools import wraps
import json
import urllib

import flask
import requests

import constants


AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'
PROFILE_URL = 'https://api.spotify.com/v1/me'


def auth_url():
    # TODO state
    query = urllib.parse.urlencode({
        'client_id': constants.SPOTIFY_CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': _redirect_uri(),
        'scope': 'user-top-read'
    })
    return AUTH_URL + '?' + query


def json_response(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        response = f(*args, **kwargs)
        return json.loads(response.content.decode())
    return wrapper


@json_response
def obtain_token(code):
    return requests.post(
        TOKEN_URL,
        {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': _redirect_uri(),
            'client_id': constants.SPOTIFY_CLIENT_ID,
            'client_secret': constants.SPOTIFY_CLIENT_SECRET
        }
    )


@json_response
def refresh_token(refresh_token_):
    return requests.post(
        TOKEN_URL,
        {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token_,
            'client_id': constants.SPOTIFY_CLIENT_ID,
            'client_secret': constants.SPOTIFY_CLIENT_SECRET
        }
    )


@json_response
def profile(token):
    return requests.get(
        PROFILE_URL,
        headers={'Authorization': _credentials(token)}
    )


def _redirect_uri():
    return flask.url_for('authorize', _external=True)


def _credentials(token):
    return 'Bearer {}'.format(token)
