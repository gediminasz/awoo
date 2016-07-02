import flask

from .base import BaseView
import spotify


class IndexView(BaseView):
    def get(self):
        context = {
            'profile': spotify.profile(),
            'top_tracks': spotify.top_tracks()
        }
        return flask.render_template('index/index.html', **context)
