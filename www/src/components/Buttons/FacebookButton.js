import React from 'react'
import FlatButton from 'material-ui/FlatButton'
// import RaisedButton from 'material-ui/RaisedButton'
// import '../../styles/icons/scss/material-design-iconic-font.css'
// import '../../styles/core.css'

const styleLabel = {
  marginLeft: '20px',
  marginRight: '20px',
  color: '#ffffff'
}

const styleLabelIcon = {
  color: '#ffffff',
}

const styleIcon = {
  paddingRight: 5
}

const styleButtonIcon = {
  minWidth: '40px'
}

export const FacebookButton = (props) => (
  defineChild(props)
)


function defineChild (props) {
  if (props.children) {
    return (
      <FlatButton
        onClick={props.onClick}
        backgroundColor='#3b5998'>

        <div style={styleLabel}>
        <i className='zmdi zmdi-facebook zmdi-hc-lg' style={styleIcon}></i>
          <span style={{ color:'lightgrey' }}>|</span><span style={styleIcon}></span>
          {props.children}
        </div>
        
      </FlatButton>
    )
  } else {
    return (
      <FlatButton
        onClick={props.onClick}
        backgroundColor='#3b5998'
        style={styleButtonIcon}>

        <div style={styleLabelIcon}>
          <i className='zmdi zmdi-facebook zmdi-hc-lg'></i>
        </div>

      </FlatButton>
    )
  }
}

export default FacebookButton
