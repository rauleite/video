import React from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
// import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import '../../styles/icons/scss/material-design-iconic-font.css'

export default class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
    this.links = props.links
  }

  handleToggle = () => this.setState({open: !this.state.open})

  handleClose = () => this.setState({open: false})

  render() {
    return (
      <div>
        {/*<FlatButton
          icon={<i className='zmdi zmdi-menu'></i>}
          onTouchTap={this.handleToggle}
        />*/}
        <FloatingActionButton
          onTouchTap={this.handleToggle}
          mini={true}>
          
          <i className='zmdi zmdi-menu'></i>
        </FloatingActionButton>

        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})} >
          { itens(this.links) }
        </Drawer>
      </div>
    );
  }
}

function itens (links) {
  let arr = []
  links.forEach((item, index) => {
    arr.push(<MenuItem key={index} >{item}</MenuItem>)
  })
  return arr
}