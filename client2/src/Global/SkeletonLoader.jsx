import React from 'react';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';

// Utility function to generate a skeleton loader
const SkeletonLoader = ({ type = 'text', ...rest }) => {
  if (type === 'circle') {
    return <SkeletonCircle {...rest} />;
  } else if (type === 'text') {
    return <SkeletonText {...rest} />;
  } else {
    return <Skeleton {...rest} />;
  }
};

export default SkeletonLoader;
