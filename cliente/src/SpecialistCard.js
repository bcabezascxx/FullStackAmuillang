import React from 'react';
import { Card } from 'react-bootstrap';

function SpecialistCard({ specialist }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={specialist.image} />
      <Card.Body>
        <Card.Title>{specialist.name}</Card.Title>
        <Card.Text>
          Especialidad: {specialist.specialty}
          <br />
          {specialist.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default SpecialistCard;
