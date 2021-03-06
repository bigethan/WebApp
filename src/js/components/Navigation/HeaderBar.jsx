import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import BallotStore from "../../stores/BallotStore";
import NavigatorInHeader from "./NavigatorInHeader";
import SearchAllBox from "../SearchAllBox";
import BookmarkStore from "../../stores/BookmarkStore";
var Icon = require("react-svg-icons");
const ReactBurgerMenu = require("react-burger-menu").push;

var menuStyles = {
  bmMenu: {
    height: "100vh"
  }
};

export default class HeaderBar extends Component {
  static propTypes = {
    voter: PropTypes.object,
    pathname: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = { bookmarks: [] };
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this._onBallotStoreChange.bind(this));
    this.bookmarkStoreListener = BookmarkStore.addListener(this._onBallotStoreChange.bind(this));
    this._onBallotStoreChange();
  }

  componentWillUnmount (){
    this.ballotStoreListener.remove();
    this.bookmarkStoreListener.remove();
  }

  _onBallotStoreChange (){
    this.setState({bookmarks: BallotStore.bookmarks });
  }

  hide () {
    const menuButton = document.querySelector(".bm-burger-button > button");
    menuButton.click();
  }

  render () {
    var { pathname } = this.props;
    var { linked_organization_we_vote_id, signed_in_facebook, signed_in_twitter, twitter_screen_name, voter_photo_url } = this.props.voter;

    let image_placeholder = "";
    let speaker_type = "V";  // TODO DALE make this dynamic
    if (speaker_type === "O") {
        image_placeholder = <span id= "anonIcon" className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    } else {
        image_placeholder = <span id= "anonIcon" className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    }

    let show_your_page_from_twitter = signed_in_twitter && twitter_screen_name;
    let show_your_page_from_facebook = signed_in_facebook && linked_organization_we_vote_id && !show_your_page_from_twitter;

    return <header className="page-header">
      <div className="page-header__content">
        <Link to="/ballot" className="page-logo h4 fullscreen">
          We Vote
          <span className="page-logo__version"> alpha</span>
        </Link>

        <Link to="/ballot" className="page-logo h4 mobile">
          WV
        </Link>
        <NavigatorInHeader pathname={pathname} />
        <SearchAllBox />

      <ReactBurgerMenu
        customBurgerIcon={
            <div id ="mobileAvatar">
              {voter_photo_url ?
                <div id="avatarContainer">
                    <img className="position-statement__avatar"
                          src={voter_photo_url}
                          id="navIcon"
                     />
                </div> : image_placeholder}
             </div> }
           className="burgerNav"
           pageWrapId={ "" }
           outerContainerId={ "app" }
           styles={ menuStyles }
           right
        >
        <div className="device-menu--mobile">
          <ul className="nav nav-stacked">
            <li>
              <div><span className="we-vote-promise">Our Promise: We'll never sell your email.</span></div>
            </li>
          </ul>
          <h4 className="text-left" />
          <ul className="nav nav-stacked">
            { show_your_page_from_twitter ?
              <li>
                <Link onClick={this.hide.bind(this)} to={"/" + twitter_screen_name}>
                  <div>
                    { voter_photo_url ?
                      <img
                        className="position-statement__avatar"
                        src={voter_photo_url}
                        width="34px"
                        id="leftAvatar"
                      /> :
                      image_placeholder }
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { show_your_page_from_facebook ?
              <li>
                <Link onClick={this.hide.bind(this)} to={"/voterguide/" + linked_organization_we_vote_id}>
                  <div>
                    { voter_photo_url ?
                      <img className="position-statement__avatar"
                            src={voter_photo_url}
                            width="34px"
                      /> :
                      image_placeholder }
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            { !show_your_page_from_twitter && !show_your_page_from_facebook ?
              <li>
                <Link onClick={this.hide.bind(this)} to="/yourpage">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Voter Guide</span>
                  </div>
                </Link>
              </li> :
              null
            }
            <li>
              <Link onClick={this.hide.bind(this)} to="/more/sign_in">
                <div>
                  <span className="header-slide-out-menu-text-left">Your Account</span>
                </div>
              </Link>
            </li>
            { this.state.bookmarks && this.state.bookmarks.length ?
              <li>
                <Link onClick={this.hide.bind(this)} to="/bookmarks">
                  <div>
                    <span className="header-slide-out-menu-text-left">Your Bookmarked Items</span>
                  </div>
                </Link>
              </li> :
              null }
            <li className="mobile">
              <Link onClick={this.hide.bind(this)} to="/more/about">
                <div>
                  <span className="header-slide-out-menu-text-left">About <strong>We Vote</strong></span>
                </div>
              </Link>
            </li>
            <li className="mobile">
              <Link onClick={this.hide.bind(this)} to="/more/donate">
                <div>
                  <span className="header-slide-out-menu-text-left">Donate</span>
                </div>
              </Link>
            </li>
          </ul>
          <span className="terms-and-privacy">
            <br />
            <Link onClick={this.hide.bind(this)} to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;<Link onClick={this.hide.bind(this)} to="/more/privacy">Privacy Policy</Link>
          </span>
        </div>
      </ReactBurgerMenu>
      <div id = "desktopAvatar">
        { voter_photo_url ?
            <div id="avatarContainer">
              <img
                className="position-statement__avatar"
                src={voter_photo_url}
                width="34px"
                id="leftAvatar"
              />
            </div> :
            image_placeholder }
        </div>
      </div>
    </header>;
  }
}
