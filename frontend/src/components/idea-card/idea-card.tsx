import React from 'react';
import {ArrowUp, ArrowDown, MessageSquare} from 'lucide-react';
import './idea-card.scss';

function IdeaCard() {
  return (
    <div className='card-cont'>
        <div className='upper-card'>
            <span className='title'>Title</span>
            <div className='category'>Tech</div>
        </div>
        <p className='content'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis eveniet, est sit deserunt dolore perspiciatis aut nihil vel maxime harum asperiores provident totam voluptatibus, voluptatem tenetur quibusdam. Veritatis laboriosam illum ea repellendus ipsum nobis, alias assumenda nisi aliquid minima libero et, odit, repudiandae exercitationem. Laboriosam atque quos ipsum aperiam, ullam perferendis numquam corrupti?</p>
        <div className='lower-card'>
            <div className='votes'><ArrowUp></ArrowUp><ArrowDown></ArrowDown></div>
            <div className='comments'><MessageSquare></MessageSquare></div>
        </div>
    </div>
  )
}

export default IdeaCard