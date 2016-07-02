import flask

from .base import BaseView
import spotify


class LoginView(BaseView):
    def get(self):
        return flask.redirect(spotify.auth_url())
