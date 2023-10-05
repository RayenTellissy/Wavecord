const debounce = (callback, timer) => {
  var isScrolling = false
  
  if(!isScrolling){
    isScrolling = true
    setTimeout(() => {
      callback()
      isScrolling = false
    }, timer)
  }
}

export default debounce