from functools import partial, wraps
import json
import urllib

import arrow
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
        'redirect_uri': flask.url_for('authorize', _external=True),
        'scope': 'user-top-read'
    })
    return AUTH_URL + '?' + query


def authorize(code):
    token_info = obtain_token(code)
    token_expires_at = arrow.utcnow().replace(seconds=token_info['expires_in'])

    flask.session['spotify_access_token'] = token_info['access_token']
    flask.session['spotify_refresh_token'] = token_info['refresh_token']
    flask.session['spotify_token_expires_at'] = token_expires_at.isoformat()


def using_token(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = _token()
        return f(token, *args, **kwargs) if token else None
    return wrapper


def _token():
    expires_at = flask.session.get('spotify_token_expires_at')
    if expires_at and (arrow.utcnow() > arrow.get(expires_at)):
        token_info = refresh_token(flask.session['spotify_refresh_token'])
        expires_at = arrow.utcnow().replace(seconds=token_info['expires_in'])
        flask.session.update({
            'spotify_access_token': token_info['access_token'],
            'spotify_token_expires_at': expires_at.isoformat()
        })

    return flask.session.get('spotify_access_token')


def obtain_token(code):
    return _post(
        TOKEN_URL,
        data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': flask.url_for('authorize', _external=True),
            'client_id': constants.SPOTIFY_CLIENT_ID,
            'client_secret': constants.SPOTIFY_CLIENT_SECRET
        }
    )


def refresh_token(refresh_token_):
    return _post(
        TOKEN_URL,
        data={
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token_,
            'client_id': constants.SPOTIFY_CLIENT_ID,
            'client_secret': constants.SPOTIFY_CLIENT_SECRET
        }
    )


@using_token
def profile(token):
    return _get(PROFILE_URL, token=token)


def _request(method, url, token=None, **kwargs):
    if token:
        kwargs.setdefault('headers', {})
        kwargs['headers']['Authorization'] = 'Bearer {}'.format(token)

    response = requests.request(method, url, **kwargs)
    return json.loads(response.content.decode())

_get = partial(_request, 'get')
_post = partial(_request, 'post')
