import flask

from .base import BaseView
import spotify


class IndexView(BaseView):
    def get(self):
        profile = spotify.profile()
        if profile:
            return flask.render_template('page.html', profile=profile)
        else:
            return flask.render_template('login.html')
