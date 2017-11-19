import flask

from .base import BaseView
import spotify


class IndexView(BaseView):
    def get(self):
        profile = spotify.profile()
        if profile:
            return self._render_index(profile)
        else:
            return flask.render_template('login.html')

    def _render_index(self, profile):
        return flask.render_template('index.html', profile=profile)
