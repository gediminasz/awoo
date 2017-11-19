import React from 'react';
import ReactDOM from 'react-dom';

const TAB_LONG_TERM = 'long_term';
const TAB_MEDIUM_TERM = 'medium_term';
const TAB_SHORT_TERM = 'short_term';

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: props.initialTab,
            tracks: {}
        };
        this.fetchTracks(props.initialTab);
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
        this.setState(
            { currentTab: tab },
            () => this.fetchTracks(tab)
        );
    }

    render() {
        return (
            <div>
                <h1>Top Tracks</h1>
                <Tabs
                    currentTab={this.state.currentTab}
                    onClick={this.switchTab.bind(this)}
                />
                <Tracks
                    tracks={this.state.tracks[this.state.currentTab]}
                />
            </div>
        );
    }
}

function Tabs(props) {
    function Tab(tabProps) {
        return (
            <li className={props.currentTab == tabProps.alias ? "active" : ""}>
                <a href="#" onClick={(e) => props.onClick(e, tabProps.alias)}>
                    {tabProps.label}
                </a>
            </li>
        );
    }

    return (
        <div className="u-pvm">
            <ul className="nav nav-tabs">
                <Tab alias={TAB_LONG_TERM} label="All time"/>
                <Tab alias={TAB_MEDIUM_TERM} label="Last 6 months"/>
                <Tab alias={TAB_SHORT_TERM} label="Last 4 weeks"/>
            </ul>
        </div>
    );
}

function Tracks(props) {
    if (!props.tracks) {
        return <p>Loading...</p>;
    }

    var rows = props.tracks.items.map(
        function(track, i) {
            return (
                <tr key={track.id}>
                    <td>{i + 1}.</td>
                    <td>
                        {track.name}
                    </td>
                    <td></td>
                    <td>{track.album.name}</td>
                </tr>
            );
        }
    );

    return (
        <table className="table table-striped table-hover">
        <thead>
            <tr>
                <th>#</th>
                <th>Song</th>
                <th>Artist</th>
                <th>Album</th>
            </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </table>
    )
}

ReactDOM.render(
    <Content initialTab={TAB_LONG_TERM}/>,
    document.getElementById('page-content')
);
