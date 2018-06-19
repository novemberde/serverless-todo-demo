import 'setimmediate'
import React from 'react'
import styled from 'styled-components'
import axios from 'axios'
import MaterialUiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { List, ListItem } from 'material-ui/List'
import { TextField, RaisedButton } from 'material-ui'
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Top from './Top'

const baseURL = 'https://l7dooy4d39.execute-api.ap-northeast-2.amazonaws.com/dev';
const App = styled.div``

const Input = styled.div`
  align-items: center;
  display: flex;
  padding: 0 1rem 1rem;
`
const StyledTextField = styled(TextField)`
  flex: 1;
`
const StyledRaisedButton = styled(RaisedButton)`
  height: 2.25rem;
  margin: 1rem 0 0 2rem;
`
const StyledRaisedDeleteButton = styled(RaisedButton)`
  height: 2.25rem;
  margin: 0.4rem 0 0 1rem;
`
const StyledListItem = styled(ListItem)`
  padding: 4rem;
  flex: 1;
`

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      inputText: '',
    }
    this.fetchItems = this.fetchItems.bind(this)
    this.addItem = this.addItem.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }
  componentWillMount() {
    this.fetchItems()
  }
  addItem() {
    axios.post(`${baseURL}/todo/`, {
      title: this.state.inputText,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }).then(() => {
      this.setState({inputText: ""});
      this.fetchItems();
    })
  }
  fetchItems() {
    axios.get(`${baseURL}/todo/`).then(({ data }) => {
      this.setState({
        items: data,
      })
    })
  }
  handleChange(e) {
    this.setState({
      inputText: e.target.value,
    })
  }
  handleKeyUp(e) {
    if(e.keyCode === 13) {
      this.addItem();
    }
  }
  deleteItem(createdAt) {
    axios.delete(`${baseURL}/todo/${createdAt}`).then(this.fetchItems);
  }
  render() {
    return (
      <MaterialUiThemeProvider>
        <App>
          <Top />
          <Input>
            <StyledTextField floatingLabelText="새 할 일을 입력하세요" value={this.state.inputText} onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
            <StyledRaisedButton label="추가" primary={true} onClick={this.addItem} />
          </Input>
          <List>
            {
              this.state.items.map((item) => (
                <StyledListItem key={item.createdAt}>
                  <ListItemText primary={item.title} />
                  <ListItemSecondaryAction>
                    <StyledRaisedDeleteButton label="삭제" secondary={true} onClick={() => this.deleteItem(item.createdAt)}/>
                  </ListItemSecondaryAction>
                </StyledListItem>
              ))
            }
          </List>
        </App>
      </MaterialUiThemeProvider>
    )
  }
}