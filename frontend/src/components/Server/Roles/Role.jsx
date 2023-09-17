import React from 'react';

// component
import Avatar from '../../common/Avatar/Avatar';

// styles
import "./Role.css"

const Role = ({ roleName, roleColor, users }) => {
  return (
    <div id='one-role-main-container'>
      <p id='one-role-name'>{roleName.toUpperCase()} - {users.length}</p>
      {users.map((e, i) => {
        return <button id='one-role-container' key={i}>
          <Avatar status={e.user.status} />
          <p style={{ color: roleColor, fontFamily: "GibsonRegular", fontSize: 18 }}>{e.user.username}</p>
        </button>
      })}
    </div>
  );
};

export default Role;