import React from 'react';
import { Skeleton, SkeletonCircle } from '@chakra-ui/react';

// styles
import "./LoadingMessages.css"

const LoadingMessages = () => {
  return (
    <div id='dm-loading-messages-container'>

      <div className='dm-loading-message-container'>
        <div className='dm-loading-message-upper'>
          <SkeletonCircle className='dm-loading-message-circle' size={55}/>
          <Skeleton height={4} width={150}/>
        </div>
        <div className='dm-loading-message-lower'>
          <Skeleton className='dm-loading-message' height={5} width={500}/>
          <Skeleton className='dm-loading-message' height={5} width={300}/>
          <Skeleton className='dm-loading-message' height={5} width={350}/>
        </div>
      </div>
      
      <div className='dm-loading-message-container'>
        <div className='dm-loading-message-upper'>
          <SkeletonCircle className='dm-loading-message-circle' size={55}/>
          <Skeleton height={4} width={150}/>
        </div>
        <div className='dm-loading-message-lower'>
          <Skeleton className='dm-loading-message' height={5} width={220}/>
          <Skeleton className='dm-loading-message' height={5} width={100}/>
        </div>
      </div>

      <div className='dm-loading-message-container'>
        <div className='dm-loading-message-upper'>
          <SkeletonCircle className='dm-loading-message-circle' size={55}/>
          <Skeleton height={4} width={150}/>
        </div>
        <div className='dm-loading-message-lower'>
          <Skeleton className='dm-loading-message' height={5} width={220}/>
          <Skeleton className='dm-loading-message' height={5} width={100}/>
        </div>
      </div>

      <div className='dm-loading-message-container'>
        <div className='dm-loading-message-upper'>
          <SkeletonCircle className='dm-loading-message-circle' size={55}/>
          <Skeleton height={4} width={150}/>
        </div>
        <div className='dm-loading-message-lower'>
          <Skeleton className='dm-loading-message' height={5} width={220}/>
          <Skeleton className='dm-loading-message' height={5} width={100}/>
          <Skeleton className='dm-loading-message' height={5} width={500}/>
          <Skeleton className='dm-loading-message' height={5} width={350}/>
        </div>
      </div>

      <div className='dm-loading-message-container'>
        <div className='dm-loading-message-upper'>
          <SkeletonCircle className='dm-loading-message-circle' size={55}/>
          <Skeleton height={4} width={150}/>
        </div>
        <div className='dm-loading-message-lower'>
          <Skeleton className='dm-loading-message' height={5} width={100}/>
          <Skeleton className='dm-loading-message' height={5} width={350}/>
        </div>
      </div>

    </div>
  );
};

export default LoadingMessages;