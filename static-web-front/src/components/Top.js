import React from 'react'
import styled from 'styled-components'
import oc from 'open-color'
import { AppBar, Drawer, MenuItem } from 'material-ui'
import LinkIcon from 'material-ui/svg-icons/content/link'
const Top = styled.div`
  align-items: center;
  background-color: ${oc.gray[8]};
  color: ${oc.white};
  display: flex;
  font-size: 1.1rem;
  left: 0;
  height: 3rem;
  justify-content: center;
  position: fixed;
  top: 0;
  width: 100%;
`

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDrawerOpened: false,
    }
    this.toggleDrawer = this.toggleDrawer.bind(this)
  }
  toggleDrawer() {
    return this.setState({
      isDrawerOpened: !this.state.isDrawerOpened,
    })
  }
  render() {
    return [
      <AppBar
        key="top-app-bar"
        title={<span>Serverless Todo</span>}
        onLeftIconButtonClick={this.toggleDrawer}
      />,
      <Drawer
        key="top-drawer"
        open={this.state.isDrawerOpened}
        onRequestChange={(isDrawerOpened) => this.setState({ isDrawerOpened })}
        docked={false}
      >
        <MenuItem leftIcon={<LinkIcon/>}><a class="nostyle" target="_blank" href="https://www.facebook.com/groups/awskrug">AWSKRUG Facebook</a></MenuItem>
        <MenuItem leftIcon={<LinkIcon/>}><a class="nostyle" target="_blank" href="http://slack.awskr.org">AWSKRUG Slack</a></MenuItem>
        <MenuItem leftIcon={<LinkIcon/>}><a class="nostyle" target="_blank" href="https://github.com/awskrug">Github</a></MenuItem>
      </Drawer>
    ]
  }
}