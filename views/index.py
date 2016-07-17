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
        time_range = flask.request.args.get('time_range')
        if time_range not in spotify.TIME_RANGE_CHOICES:
            return flask.redirect(flask.url_for('index', time_range=spotify.TIME_RANGE_LONG_TERM))

        top_tracks = spotify.top_tracks(time_range=time_range)

        for track in top_tracks['items']:
            artist_names = (artist['name'] for artist in track['artists'])
            track['_artist_names'] = ', '.join(artist_names)

        context = {
            'profile': profile,
            'time_range_tabs': self._time_range_tabs(time_range),
            'top_tracks': top_tracks
        }
        return flask.render_template('index.html', **context)

    def _time_range_tabs(self, current_time_range):
        for time_range, label in spotify.TIME_RANGE_CHOICES.items():
            yield {
                'time_range': time_range,
                'label': label,
                'active': time_range == current_time_range
            }
