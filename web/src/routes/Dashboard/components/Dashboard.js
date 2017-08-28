import { Card, CardText, CardTitle } from 'material-ui/Card'
import React from 'react'
import PropTypes from 'prop-types'

const Dashboard = ({ secretData }) => (
  <Card className=''>
    <CardTitle
      title='Dashboard'
      subtitle='You should get access to this page only after authentication.'
    />

    {secretData && <CardText style={{ fontSize: '16px', color: 'green' }}>{secretData}</CardText>}
  </Card>
)

Dashboard.propTypes = {
  secretData: PropTypes.string.isRequired
}

export default Dashboard
