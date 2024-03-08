/* eslint-disable */
import React, { useEffect } from 'react';
import { Collapse, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { HasAccess,usePermify } from '@permify/react-role';
 
const NavSubMenu = ({ icon, title, items, isUrl, suffixColor, suffix }) => {
  const location = useLocation();

  const [collapsed, setCollapsed] = React.useState(false);
  const getActive = document.getElementsByClassName('activeLink');
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const { isAuthorized, isLoading } = usePermify();

  const fetchData = async () => {
items.forEach(async(module)=>{
   // Pass roles and permissions accordingly
    // You can send empty array or null for first param to check permissions only
    if (await isAuthorized(null, `${module.section_title}-list`)) {
      return true
   }
     return false
})
   
    
};

  useEffect(() => {
    if (isUrl) {
      setCollapsed(!collapsed);
     
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavItem className={collapsed && getActive ? 'activeParent' : ''}>
      <NavLink className="cursor-pointer gap-3" onClick={toggle}>
        <span className="sidebarIcon">{icon}</span>
        <span className="hide-mini w-100">
          <div className="d-flex align-items-center">
            <span className="d-block">{title}</span>
            <span className="ms-auto">
              <span className={`badge me-2 ${suffixColor}`}>{suffix}</span>
              <i className={`bi fs-8 ${collapsed ? 'bi-chevron-down' : 'bi-chevron-right'}`} />
            </span>
          </div>
        </span>
      </NavLink>

      <Collapse isOpen={collapsed} navbar tag="ul" className="subMenu">
        {items.map((item) => (
        //    <HasAccess
        //    roles={null}
        //    permissions={`${item.section_title}-list`}
        //    renderAuthFailed={<p></p>}
        //    key={item.section_title}
        //  >
        <>
           <NavItem
            key={item.section_title}
            className={`hide-mini  ${location.pathname === item.internal_link ? 'activeLink' : ''}`}
          >
            <NavLink tag={Link} to={item.internal_link} className="gap-3">
              <span className="sidebarIcon">{item.icon}</span>
              <span className="hide-mini">
                <span>{item.section_title}</span>
              </span>
            </NavLink>
          </NavItem>
          </>
          // </HasAccess>
         
        ))}
      </Collapse>
    </NavItem>
  );
};
NavSubMenu.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
  icon: PropTypes.node,
  isUrl: PropTypes.bool,
  suffix: PropTypes.any,
  suffixColor: PropTypes.string,
};
export default NavSubMenu;
