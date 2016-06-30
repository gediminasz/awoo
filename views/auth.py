import flask

from .base import BaseView
import spotify


class AuthorizationView(BaseView):
    def get(self):
        code = flask.request.args['code']
        spotify.authorize(code)
        return flask.redirect(flask.url_for('index'))
