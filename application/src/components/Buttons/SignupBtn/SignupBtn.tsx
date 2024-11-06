import React from 'react'
import { User } from 'lucide-react'
import { Link } from 'react-router-dom'

const SignupBtn: React.FC = () => {
  return (
    <Link to="/signup"><button><User/>Signup</button></Link>
  )
}

export default SignupBtn