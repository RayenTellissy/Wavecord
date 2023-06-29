import React from 'react';
import { faBolt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@chakra-ui/react';

// styles
import "./Home.css"

const Home = () => {
  return (
    <div>
      <Button leftIcon={<FontAwesomeIcon icon={faBolt} />}>
        Turbo
      </Button>
    </div>
  );
};

export default Home;