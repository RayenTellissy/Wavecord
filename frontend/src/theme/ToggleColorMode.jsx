import { Button } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons"
import { useColorMode } from "@chakra-ui/color-mode"

import styles from "./theme.styles";

const ToggleColorMode = () => {

  const { colorMode, toggleColorMode } = useColorMode() // ChakraUI Hook to change colormode

  return (
    <Button style={styles.button} onClick={toggleColorMode}>
      {colorMode === "dark" ? <MoonIcon/> : <SunIcon/>}
    </Button>
  )
}

export default ToggleColorMode