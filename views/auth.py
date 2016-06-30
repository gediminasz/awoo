import arrow
import flask

from .base import BaseView
import spotify


class AuthorizationView(BaseView):
    def get(self):
        code = flask.request.args['code']

        token_info = spotify.obtain_token(code)

        token_expires_at = arrow.utcnow().replace(seconds=token_info['expires_in'])

        flask.session['spotify_access_token'] = token_info['access_token']
        flask.session['spotify_refresh_token'] = token_info['refresh_token']
        flask.session['spotify_token_expires_at'] = token_expires_at.isoformat()

        return flask.redirect(flask.url_for('index'))
