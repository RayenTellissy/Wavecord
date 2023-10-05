import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { disableReactDevTools } from "@fvilers/disable-react-devtools"

import App from "./App"
import theme from './theme/theme'
import { ContextProvider } from './components/Context/Context'

// disabling react dev tools in production (for security)
if(process.env.NODE_ENV === "production"){
  disableReactDevTools()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App/>
        </ChakraProvider>
      </BrowserRouter>
    </ContextProvider>
  </React.StrictMode>
)