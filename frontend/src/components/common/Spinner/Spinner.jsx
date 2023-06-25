import { Spinner } from "@chakra-ui/react";

import "./Spinner.css"

const Loader = () => {
  return (
    <div id="spinner-container">
      <Spinner boxSize={24} thickness="5px" color="#62CAC2"/>
    </div>
  )
}

export default Loader