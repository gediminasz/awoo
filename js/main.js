import React from 'react';
import ReactDOM from 'react-dom';

const TAB_LONG_TERM = 'long_term';
const TAB_MEDIUM_TERM = 'medium_term';
const TAB_SHORT_TERM = 'short_term';

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: TAB_LONG_TERM
        };
    }

    switchTab(e, tab) {
        e.preventDefault();
        this.setState({ currentTab: tab });
    }

    render() {
        return (
            <div>
                <h1>Top Tracks</h1>
                <Tabs
                    currentTab={this.state.currentTab}
                    onClick={this.switchTab.bind(this)}
                />
            </div>
        );
    }
}

function Tabs(props) {
    return (
        <div className="u-pvm">
            <ul className="nav nav-tabs">
                <li className={props.currentTab == TAB_LONG_TERM ? "active" : ""}>
                    <a href="#" onClick={(e) => props.onClick(e, TAB_LONG_TERM)}>
                        All time
                    </a>
                </li>
                <li className={props.currentTab == TAB_MEDIUM_TERM ? "active" : ""}>
                    <a href="#" onClick={(e) => props.onClick(e, TAB_MEDIUM_TERM)}>
                        Last 6 months
                    </a>
                </li>
                <li className={props.currentTab == TAB_SHORT_TERM ? "active" : ""}>
                    <a href="#" onClick={(e) => props.onClick(e, TAB_SHORT_TERM)}>
                        Last 4 weeks
                    </a>
                </li>
            </ul>
        </div>
    );
}

ReactDOM.render(
    <Content/>,
    document.getElementById('page-content')
);
