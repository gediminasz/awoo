import flask

from views.auth import AuthorizationView
from views.index import IndexView
from views.login import LoginView
from views.logout import LogoutView
from views.tracks import TracksView
import constants

app = flask.Flask(__name__)
app.secret_key = constants.SECRET_KEY
app.config.update(
    SERVER_NAME=constants.SERVER_NAME
)

app.add_url_rule('/', view_func=IndexView.as_view('index'), methods=('GET',))
app.add_url_rule('/authorize', view_func=AuthorizationView.as_view('authorize'), methods=('GET',))
app.add_url_rule('/login', view_func=LoginView.as_view('login'), methods=('GET',))
app.add_url_rule('/logout', view_func=LogoutView.as_view('logout'), methods=('GET',))
app.add_url_rule('/tracks', view_func=TracksView.as_view('tracks'), methods=('GET',))
