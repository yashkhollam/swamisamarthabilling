import React from 'react'
 //import Bill from './Bill'
 import Bill2 from './Bill2'
 import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Previewbill from './Previewbill'

function App() {
  return (
    // <Bill/>
    //  <Bill2/>

     <BrowserRouter>
      <Routes>
        <Route path='/' element={<Bill2/>}/>
         <Route path="/previewbill/:billId"  element={<Previewbill/>} />
      </Routes>
     </BrowserRouter>
  )
}

export default App