import React from 'react'
import { User } from 'lucide-react'
import { Link } from 'react-router-dom'

function UserBtn() {
  return (
    <Link to="/user"><button><User/>Shoaib Akhtar</button></Link>
  )
}

export default UserBtn