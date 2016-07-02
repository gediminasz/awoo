import flask

from views.auth import AuthorizationView
from views.index import IndexView
from views.login import LoginView
import constants

app = flask.Flask(__name__)
app.secret_key = constants.SECRET_KEY

app.add_url_rule('/', view_func=IndexView.as_view('index'), methods=('GET',))
app.add_url_rule('/login', view_func=LoginView.as_view('login'), methods=('GET',))
app.add_url_rule('/authorize', view_func=AuthorizationView.as_view('authorize'), methods=('GET',))
