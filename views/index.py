import flask

from .base import BaseView
import spotify


class IndexView(BaseView):
    def get(self):
        context = {
            'profile': self._fetch_profile(),
            'spotify_auth_url': spotify.auth_url()
        }
        return flask.render_template('index.html', **context)

    def _fetch_profile(self):
        if self.spotify_token:
            return spotify.profile(self.spotify_token)
