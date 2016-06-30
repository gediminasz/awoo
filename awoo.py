import flask

from views.index import IndexView
from views.auth import AuthorizationView
import constants

app = flask.Flask(__name__)
app.secret_key = constants.SECRET_KEY

app.add_url_rule('/', view_func=IndexView.as_view('index'), methods=('GET',))
app.add_url_rule(
    '/authorize',
    view_func=AuthorizationView.as_view('authorize'),
    methods=('GET',)
)
