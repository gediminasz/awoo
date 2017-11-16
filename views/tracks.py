import flask

from .base import BaseView
import spotify


class TracksView(BaseView):
    def get(self):
        time_range = flask.request.args.get('time_range')
        if time_range not in spotify.TIME_RANGE_CHOICES:
            response = flask.jsonify({'error': 'Invalid time_range'})
            response.status_code = 400
            return response

        top_tracks = spotify.top_tracks(time_range=time_range)
        return flask.jsonify(top_tracks)
