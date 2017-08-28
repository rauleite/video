import React from 'react'

export const Borda = ({children}) => (
  <div className='container-fluid-up-sm'>

    <div className='row' >
      <div className='hidden-col-xs col-sm-2 col-md-3'>

      </div>
      
      <div className='col-xs-12 col-sm-8 col-md-6'>
        {children}
      </div>

      <div className='hidden-col-xs col-sm-2 col-md-3'>

      </div>

    </div>
  </div>
)

export default Borda
