from flask.views import MethodView
import arrow
import flask

import spotify


class BaseView(MethodView):
    @property
    def spotify_token(self):
        self._refresh_token()
        return flask.session.get('spotify_access_token')

    def _refresh_token(self):
        expires_at = flask.session.get('spotify_token_expires_at')
        if expires_at and (arrow.utcnow() > arrow.get(expires_at)):
            token_info = spotify.refresh_token(flask.session['spotify_refresh_token'])
            expires_at = arrow.utcnow().replace(seconds=token_info['expires_in'])
            flask.session.update({
                'spotify_access_token': token_info['access_token'],
                'spotify_token_expires_at': expires_at.isoformat()
            })
