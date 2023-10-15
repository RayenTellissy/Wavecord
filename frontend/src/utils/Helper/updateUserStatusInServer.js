// function to update the current user's status locally when he changes it
const updateUserStatusInServer = (userId, newStatus, roles, noRoles, setRoles, setNoRoles) => {
  const updatedRolesArray = roles.map(role => ({
    ...role,
    UsersInServers: role.UsersInServers.map(userInServer => ({
      ...userInServer,
      user: userInServer.user.id === userId ? { ...userInServer.user, status: newStatus } : userInServer.user
    }))
  }))

  const updatedNoRolesArray = noRoles.map(user => ({
    ...user,
    user: user.user.id === userId ? { ...user.user, status: newStatus } : user.user
  }))
  
  setRoles(updatedRolesArray)
  setNoRoles(updatedNoRolesArray)
}

export default updateUserStatusInServer