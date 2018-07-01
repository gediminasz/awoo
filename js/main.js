import React from 'react';
import ReactDOM from 'react-dom';

const TAB_LONG_TERM = 'long_term';
const TAB_MEDIUM_TERM = 'medium_term';
const TAB_SHORT_TERM = 'short_term';
const TABS = {
    [TAB_LONG_TERM]: 'All time',
    [TAB_MEDIUM_TERM]: 'Last 6 months',
    [TAB_SHORT_TERM]: 'Last 4 weeks'
}

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: props.initialTab,
            tracks: {},
            nowPlaying: {
                track: null,
                audio: null
            }
        };
    }

    // TODO extract player component or something

    playPreview(track) {
        this.stopPlayback();

        const audio = new Audio(track.preview_url);
        audio.play()
        audio.addEventListener('ended', () => this.stopPreview());
        this.setState({ nowPlaying: { track, audio } });
    }

    stopPreview() {
        this.stopPlayback();
        this.setState({ nowPlaying: { track: null, audio: null } });
    }

    stopPlayback() {
        if (this.state.nowPlaying.audio) {
            this.state.nowPlaying.audio.pause();
        }
    }

    componentDidMount() {
        this.fetchTracks(this.props.initialTab);
    }

    fetchTracks(tab) {
        if (!this.state.tracks[tab]) {
            fetch('/tracks?time_range=' + tab, { credentials: "same-origin" })
                .then((response) => response.json())
                .then((data) => this.setState({ tracks: Object.assign({}, this.state.tracks, { [tab]: data })}));
        }
    }

    switchTab(e, tab) {
        e.preventDefault();
        this.setState({ currentTab: tab });
        this.fetchTracks(tab);
    }

    render() {
        var tracks = this.state.tracks[this.state.currentTab];
        return (
            <div>
                <h1>Top Tracks</h1>
                <Tabs
                    currentTab={this.state.currentTab}
                    onClick={this.switchTab.bind(this)}
                />
                {
                    tracks
                    ? (
                        <Tracks
                            tracks={tracks}
                            playPreview={(track) => this.playPreview(track)}
                            stopPreview={() => this.stopPreview()}
                            nowPlaying={this.state.nowPlaying}
                        />
                    )
                    : <p>Loading...</p>
                }
            </div>
        );
    }
}

function Tabs(props) {
    var tabs = Object.entries(TABS).map(
        ([alias, label]) => (
            <Tab
                key={alias}
                alias={alias}
                label={label}
                active={alias == props.currentTab}
                onClick={props.onClick}
            />
        )
    );
    return (
        <div className="u-pvm">
            <ul className="nav nav-tabs">
                {tabs}
            </ul>
        </div>
    );
}

function Tab(props) {
    return (
        <li className="nav-item">
            <a
                href="#"
                className={`nav-link ${props.active ? "active" : ""}`}
                onClick={(e) => props.onClick(e, props.alias)}
            >
                {props.label}
            </a>
        </li>
    );
}

function Tracks(props) {
    var rows = props.tracks.items.map((track, i) => (
        <Track
            key={track.id}
            track={track}
            number={i + 1}
            playPreview={() => props.playPreview(track)}
            stopPreview={props.stopPreview}
            isPlaying={props.nowPlaying.track && (track.id === props.nowPlaying.track.id)}
        />
    ));
    return (
        <table className="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Song</th>
                <th>Artist</th>
                <th>Album</th>
                <th>Preview</th>
            </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </table>
    )
}

function Track(props) {
    return (
        <tr>
            <td className="track-number">
                {props.number}.
            </td>
            <td className="track-name">
                {props.track.name}
            </td>
            <td className="track-artist">
                {props.track.artists.map((artist) => artist.name).join(', ')}
            </td>
            <td className="track-album">
                {props.track.album.name}
            </td>
            <td className="track-preview">
                {props.track.preview_url && (
                    props.isPlaying
                    ? (<button className="btn btn-outline-light" onClick={props.stopPreview}>⏹️</button>)
                    : (<button className="btn btn-outline-light" onClick={props.playPreview}>▶️</button>)
                )}
            </td>
        </tr>
    );
}

ReactDOM.render(
    <Content initialTab={TAB_LONG_TERM}/>,
    document.getElementById('page-content')
);
