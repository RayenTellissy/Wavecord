import React from 'react';

// component
import Avatar from '../../common/Avatar/Avatar';

// styles
import "./Role.css"

const Role = ({ roleName, roleColor, users }) => {
  return (
    <>
      {users.length !== 0 && <div className='one-role-main-container'>
        <p className='one-role-name'>{roleName.toUpperCase()} - {users.length}</p>
        {users.map((e, i) => {
          if(e.user.status !== "OFFLINE"){
            return <button className='one-role-container' key={i}>
              <Avatar image={e.user.image} status={e.user.status} />
              <p style={{ color: roleColor, fontFamily: "GibsonRegular", fontSize: 18 }}>{e.user.username}</p>
            </button>
          }
        })}
      </div>}
    </>
  );
};

export default Role;