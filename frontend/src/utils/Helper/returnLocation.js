const returnLocation = (location) => {
  const path = location.split("/")
  path.shift()
  return path
}

export default returnLocation