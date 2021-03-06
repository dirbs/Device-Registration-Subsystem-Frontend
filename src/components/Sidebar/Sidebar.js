import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Badge, Nav, NavItem, NavLink as RsNavLink} from 'reactstrap';
import classNames from 'classnames';
import nav from './_nav';
import { I18n } from 'react-i18next';
import {getUserRole} from "../../utilities/helpers";
import {EXPORTER, BULK_IMPORTER, INDIVIDUAL_IMPORTER} from "../../utilities/constants";

class Sidebar extends Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.activeRoute = this.activeRoute.bind(this);
    this.hideMobile = this.hideMobile.bind(this);
  }


  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName, props) {
    // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
    return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';

  }

  hideMobile() {
    if (document.body.classList.contains('sidebar-mobile-show')) {
      document.body.classList.toggle('sidebar-mobile-show')
    }
  }

  // todo Sidebar nav secondLevel
  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }


  render() {

    const props = this.props;

    // badge addon to NavItem
    const badge = (badge) => {
      if (badge) {
        const classes = classNames( badge.class );
        return (<Badge className={ classes } color={ badge.variant }>{ badge.text }</Badge>)
      }
    };

    // simple wrapper for nav-title item
    const wrapper = item => {
      return (item.wrapper && item.wrapper.element
        ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name))
        : item.name ) };

    // nav list section title
    const title =  (title, key) => {
      const classes = classNames( 'nav-title', title.class);
      return (<li key={key} className={ classes }>{wrapper(title)} </li>);
    };

    // nav list divider
    const divider = (divider, key) => {
      const classes = classNames( 'divider', divider.class);
      return (<li key={key} className={ classes }></li>);
    };

    // nav label with nav link
    const navLabel = (item, key) => {
      const classes = {
        item: classNames( 'hidden-cn', item.class ),
        link: classNames( 'nav-label', item.class ? item.class : ''),
        icon: classNames(
          !item.icon ? 'fa fa-circle' : item.icon ,
          item.label.variant ? `text-${item.label.variant}` : '',
          item.label.class ?  item.label.class : ''
        )
      };
      return (
        navLink(item, key, classes)
      );
    };

    // nav item with nav link
    const navItem = (item, key) => {
      const classes = {
        item: classNames( item.class) ,
        link: classNames( 'nav-link', item.variant ? `nav-link-${item.variant}` : ''),
        icon: classNames( item.icon )
      };
      return (
        navLink(item, key, classes)
      )
    };

    // nav link
    const navLink = (item, key, classes) => {
      const url = item.url ? item.url : '';
      let links = '';
      switch (getUserRole(props.resources)) {
          case EXPORTER:
            if(url === '/new-request/id' || url === '/association' ||  url === '/de-association' || url === '/search-logging') {
                // Ignore this route for above group
            } else {
              links = <NavLink to={url} className={classes.link} activeClassName="active" onClick={this.hideMobile}>
                        <i className={classes.icon}></i>{props.t(item.name)}{badge(item.badge)}
                      </NavLink>
            }
          break;

          case BULK_IMPORTER:
              if(url === '/de-registration/id' || url === '/association' ||  url === '/de-association' || url === '/search-logging') {
                // Ignore this route for above group
            } else {
              links = <NavLink to={url} className={classes.link} activeClassName="active" onClick={this.hideMobile}>
                        <i className={classes.icon}></i>{props.t(item.name)}{badge(item.badge)}
                      </NavLink>
            }
          break;

          case INDIVIDUAL_IMPORTER:
            if(url === '/de-registration/id' || url === '/search-logging') {
                // Ignore this route for above group
            } else {
              links = <NavLink to={url} className={classes.link} activeClassName="active" onClick={this.hideMobile}>
                        <i className={classes.icon}></i>{props.t(item.name)}{badge(item.badge)}
                      </NavLink>
            }
          break;

          default:
            if(url === '/new-request/id' || url === '/de-registration/id' || url === '/association' ||  url === '/de-association') {
                // Ignore these routes for above group
            } else {
              links = <NavLink to={url} className={classes.link} activeClassName="active" onClick={this.hideMobile}>
                        <i className={classes.icon}></i>{props.t(item.name)}{badge(item.badge)}
                      </NavLink>
            }
          break;
      }
      return (
        <I18n ns="translations" key={key}>
        {
          (t, { i18n }) => (
            <NavItem key={key} className={classes.item}>
              { isExternal(url) ?
                <RsNavLink href={url} className={classes.link} active>
                  <i className={classes.icon}></i>{t(item.name)}{badge(item.badge)}
                </RsNavLink>
                :
                  <div>
                    {links}
                  </div>
              }
            </NavItem>
            )
        }
        </I18n>
      )
    };

    // nav dropdown
    const navDropdown = (item, key) => {
      return (
        <li key={key} className={this.activeRoute(item.url, this.props)}>
          <button className="btn btn-sm btn-link nav-link nav-dropdown-toggle" onClick={this.handleClick}><i className={item.icon}></i>{this.props.t(item.name)}</button>
          <ul className="nav-dropdown-items">
            {navList(item.children)}
          </ul>
        </li>)
    };

    // nav type
    const navType = (item, idx) =>
      item.title ? title(item, idx) :
      item.divider ? divider(item, idx) :
      item.label ? navLabel(item, idx) :
      item.children ? navDropdown(item, idx)
                    : navItem(item, idx) ;

    // nav list
    const navList = (items) => {
      return items.map( (item, index) => navType(item, index) );
    };

    const isExternal = (url) => {
      const link = url ? url.substring(0, 4) : '';
      return link === 'http';
    };

    // sidebar-nav root
    return (
      <div className="sidebar">
        <nav className="sidebar-nav">
          <Nav>
            {navList(nav.items)}
          </Nav>
        </nav>
      </div>
    )
  }
}

export default Sidebar;
