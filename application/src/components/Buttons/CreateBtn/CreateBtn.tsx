// import React from 'react'
import {Lightbulb} from "lucide-react";
import { Link } from 'react-router-dom';
import './CreateBtn.scss';

function CreateBtn() {
  return (
    <Link to="/NewIdea" className='link-cont'>
      <button className='btn-cont'>
      <Lightbulb></Lightbulb>
      <span>New Idea</span>
    </button>
    </Link>
  )
}

export default CreateBtn