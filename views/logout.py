import flask

from .base import BaseView


class LogoutView(BaseView):
    def get(self):
        flask.session.clear()
        return flask.redirect(flask.url_for('index'))
