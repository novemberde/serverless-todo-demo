import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import App from './components/App'

ReactDOM.render(<App />, document.getElementById('app'))

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
