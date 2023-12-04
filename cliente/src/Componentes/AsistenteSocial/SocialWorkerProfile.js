import React from 'react';
import "./AsistenteSocial.css"

const SocialWorkerProfile = ({ socialWorker }) => {
  return (
    <div className="socialWorker-profile">
      <img  
      src={require(`./${socialWorker.photo}.jpg`)}
      alt={socialWorker.name} />
      <div className='socialWorker-info'>
      <h2>{socialWorker.name}</h2>
      <p>{socialWorker.title}</p>
      <p>{socialWorker.contact}</p>
      </div>
    </div>
  );
};

export default SocialWorkerProfile;