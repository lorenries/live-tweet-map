import React from 'react';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import io from 'socket.io-client';
import { default as ReactMapGL, SVGOverlay } from 'react-map-gl';
import MAP_STYLE from './assets/style.json';
import sound from './Sound.js';
import { Transition, TransitionGroup } from 'react-transition-group';

class App extends React.Component {
  state = {
    tweets: {},
    mapStyle: MAP_STYLE,
    viewport: {
      width: 500,
      height: 500,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 2
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
    this.getTweets();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
  };

  _onViewportChange = viewport => this.setState({ viewport });

  getTweets = () => {
    const socket = io.connect(
      `${
        process.env.NODE_ENV === 'production'
          ? 'https://zesty-teeth.glitch.me/'
          : 'http://localhost:8080'
      }`
    );
    const tweets = { ...this.state.tweets };
    let that = this;
    let tweetId = 0;
    socket.on('tweet', function(tweet) {
      const key = tweetId;
      tweets[key] = tweet;
      that.setState({
        tweets
      });
      setTimeout(() => {
        delete tweets[key];
      }, 2000);
      tweetId++;
      sound();
    });
  };

  redraw = ({ project }) => {
    return (
      <TransitionGroup component="g">
        {Object.entries(this.state.tweets).map(tweet => {
          const key = tweet[0];
          const [cx, cy] = project(tweet[1].coordinates.coordinates);
          const duration = 500;
          const defaultStyle = {
            transition: `all ${duration}ms ease-in-out`,
            opacity: 0
          };
          const transitionStyles = {
            entering: { opacity: 0 },
            entered: { opacity: 1 },
            exiting: { opacity: 1 },
            exited: { opacity: 0 }
          };
          const rippleDefault = {
            fill: '#eb284e',
            transition: `all ${duration}ms ease-in-out`,
            fillOpacity: 0
          };
          const rippleTransition = {
            entering: {
              fillOpacity: 0
            },
            entered: { fillOpacity: 0.4 },
            exiting: { fillOpacity: 0.4 },
            exited: { fillOpacity: 0 }
          };
          const rippleRadius = {
            entering: 4,
            entered: 4,
            exiting: 12,
            exited: 12
          };
          return (
            <Transition timeout={duration} unmountOnExit key={key}>
              {state => (
                <g>
                  <circle
                    id={key}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#eb284e"
                    style={{
                      ...defaultStyle,
                      ...transitionStyles[state]
                    }}
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={rippleRadius[state]}
                    style={{
                      ...rippleDefault,
                      ...rippleTransition[state]
                    }}
                  />
                </g>
              )}
            </Transition>
          );
        })}
      </TransitionGroup>
    );
  };

  render() {
    return (
      <div className="App">
        <ReactMapGL
          {...this.state.viewport}
          mapStyle={this.state.mapStyle}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          onViewportChange={this._onViewportChange}
        >
          <SVGOverlay redraw={this.redraw} />
        </ReactMapGL>
      </div>
    );
  }
}

export default App;
