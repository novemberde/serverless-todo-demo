import 'setimmediate'
import React from 'react'
import styled from 'styled-components'
import axios from 'axios'
import MaterialUiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { List, ListItem } from 'material-ui/List'
import { TextField, RaisedButton } from 'material-ui'
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
const StyledRaisedActionButton = styled(RaisedButton)`
  height: 2.25rem;
  margin: 0rem 0rem 0.4rem 0rem;
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
      open: false,
    }
    this.fetchItems = this.fetchItems.bind(this)
    this.addItem = this.addItem.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.updateItem = this.updateItem.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleChangeItem = this.handleChangeItem.bind(this)
  }
  componentWillMount() {
    this.fetchItems()
  }
  handleOpen () {
    this.setState({ open: true });
  }
  handleClose () {
    this.setState({ open: false });
  }
  addItem() {
    axios.post(`${baseURL}/todo/`, {
      title: this.state.inputText,
      content: '',
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
    const nextState = {};
    nextState[e.target.name] = e.target.value
    this.setState(nextState);
  }
  handleKeyUp(e) {
    if(e.keyCode === 13) {
      this.addItem();
    }
  }
  deleteItem(createdAt) {
    axios.delete(`${baseURL}/todo/${createdAt}`).then(this.fetchItems);
  }
  updateItem(createdAt, title) {
    axios.put(`${baseURL}/todo/${createdAt}`, {
      title,
    }).then(this.fetchItems);
  }
  handleChangeItem(e, i) {
    const nextItems = [
      ...this.state.items
    ];
    nextItems[i].title = e.target.value;
    this.setState(Object.assign(this.state, {
      items: nextItems
    }));
  }
  render() {
    return (
      <MaterialUiThemeProvider>
        <App>
          <Top />
          <Input>
            <StyledTextField floatingLabelText="새 할 일을 입력하세요" name="inputText" value={this.state.inputText} onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
            <StyledRaisedButton label="추가" primary={true} onClick={this.addItem} />
          </Input>
          <List>
            {
              this.state.items.map((item, i) => (
                <StyledListItem key={item.createdAt}>
                  <TextField name={`title${i}`} value={item.title} fullWidth onChange={(e) => this.handleChangeItem(e, i)}/>
                  <ListItemSecondaryAction>
                    <StyledRaisedActionButton label="수정" primary={true} onClick={() => this.updateItem(item.createdAt, item.title)}/>
                    <StyledRaisedActionButton label="삭제" secondary={true} onClick={() => this.deleteItem(item.createdAt)}/>
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