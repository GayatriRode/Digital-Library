import React from 'react';

const Section = ({ id, title, children }) => {
  return (
    <section id={id} className="mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  );
};

export default Section;
