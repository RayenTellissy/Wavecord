const returnServerIds = (servers) => {
  const arr = []
  if(servers){
    servers.map(e => {
      arr.push(e.server.id)
    })
    return arr
  }
}

export default returnServerIds