import React, { useEffect } from 'react';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About';
  });

  return (
    <div>About Page</div>
  )
}
