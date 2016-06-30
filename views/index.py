import flask

from .base import BaseView
import spotify


class IndexView(BaseView):
    def get(self):
        context = {
            'profile': spotify.profile(),
            'spotify_auth_url': spotify.auth_url()
        }
        return flask.render_template('index.html', **context)
