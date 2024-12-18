import React from 'react'
import Sidebar from '../components/Sidebar'
import { Box,Typography } from '@mui/material'

function Reports() {
  return (

       <>
    <Box sx={{display:'flex'}}>
    <Sidebar/>

    <Box component="main" sx={{ flexGrow:1, p:3, marginTop:"65px"}}>

    <Typography>Sales King</Typography>

      </Box>

  </Box>
  </>
  )
}

export default Reports