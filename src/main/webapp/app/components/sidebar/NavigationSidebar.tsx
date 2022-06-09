import React from 'react';
import './navigation-sidebar.scss';
import { observer } from 'mobx-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PAGE_ROUTE } from 'app/config/constants';
import { IRootStore } from 'app/stores/createStore';
import { componentInject } from 'app/shared/util/typed-inject';
import { NavLink } from 'react-router-dom';
import { ProSidebar, Menu, MenuItem, SidebarContent } from 'react-pro-sidebar';
import { faBars, faBuilding, faSearch, faPills, faFileAlt, faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';

class NavigationSidebar extends React.Component<StoreProps> {
  render() {
    return (
      <div className="sidebar-wrapper">
        <ProSidebar collapsed={this.props.isSideBarCollapsed}>
          <SidebarContent>
            <Menu>
              <MenuItem icon={<FontAwesomeIcon size="lg" icon={faBars} />} onClick={this.props.toggleSideBar} />
            </Menu>
            <Menu>
              <MenuItem icon={<FontAwesomeIcon size="lg" icon={faSearch} />}>
                Search <NavLink to={PAGE_ROUTE.SEARCH} />
              </MenuItem>
              <MenuItem icon={<b style={{ fontSize: '1.5em' }}>G</b>}>
                Gene <NavLink to={PAGE_ROUTE.GENE} />
              </MenuItem>
              <MenuItem icon={<b style={{ fontSize: '1.5em' }}>A</b>}>
                Alteration <NavLink to={PAGE_ROUTE.ALTERATION} />
              </MenuItem>
              <MenuItem icon={<FontAwesomeIcon size="lg" icon={faFileAlt} />}>
                Article <NavLink to={PAGE_ROUTE.ARTICLE} />
              </MenuItem>
              <MenuItem icon={<FontAwesomeIcon size="lg" icon={faPills} />}>
                Drug <NavLink to={PAGE_ROUTE.DRUG} />
              </MenuItem>
              <MenuItem icon={<FontAwesomeIcon size="lg" icon={faBuilding} />}>
                CDx
                <NavLink to={PAGE_ROUTE.CDX} />
              </MenuItem>
              <MenuItem icon={<b style={{ fontSize: '1.2em' }}>FDA</b>}>
                Submission <NavLink to={PAGE_ROUTE.FDA_SUBMISSION} />
              </MenuItem>
            </Menu>
          </SidebarContent>
        </ProSidebar>
      </div>
    );
  }
}

const mapStoreToProps = ({ layoutStore }: IRootStore) => ({
  isSideBarCollapsed: layoutStore.isSideBarCollapsed,
  toggleSideBar: layoutStore.toggleSideBar,
});

type StoreProps = {
  isSideBarCollapsed?: boolean;
  toggleSideBar?: () => void;
};

export default componentInject(mapStoreToProps)(observer(NavigationSidebar));