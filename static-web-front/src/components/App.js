import 'setimmediate'
import React from 'react'
import styled from 'styled-components'
import oc from 'open-color'
import axios from 'axios'
import MaterialUiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { List, ListItem } from 'material-ui/List'
import { TextField, RaisedButton } from 'material-ui'
import Top from './Top'
import $ from 'jquery'

const baseURL = 'https://w1oefi6dgj.execute-api.ap-northeast-2.amazonaws.com/dev/';
const myAxios = axios.create({
  baseURL
});
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
const StyledListItem = styled(ListItem)`
  padding: 4rem;
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
    this.onChangeTextField = this.onChangeTextField.bind(this)
  }
  componentWillMount() {
    this.fetchItems()
  }
  addItem() {
    $.post( `${baseURL}/todo/`, {
      title: this.state.inputText,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }).done(() => {
      this.setState({inputText: ""});
      this.fetchItems();
    });
  }
  fetchItems() {
    myAxios.get('todo/')
      .then(({ data }) => {
        this.setState({
          items: data,
        })
      })
  }
  onChangeTextField(event) {
    this.setState({
      inputText: event.target.value,
    })
  }
  render() {
    return (
      <MaterialUiThemeProvider>
        <App>
          <Top />
          <Input>
            <StyledTextField floatingLabelText="새 할 일을 입력하세요" value={this.state.inputText} onChange={this.onChangeTextField}/>
            <StyledRaisedButton label="추가" primary={true} onClick={this.addItem} />
          </Input>
          <List>
            {
              this.state.items.map((item) => (
                <StyledListItem key={item.createdAt} primaryText={item.title}/>
              ))
            }
          </List>
        </App>
      </MaterialUiThemeProvider>
    )
  }
}