import React from 'react';
import { Link } from 'react-router-dom';

const Logout = () => {
  return (
    <section className="flex grow justify-center  self-center h-full w-full py-10">
      <div>
        <h1 className="text-3xl">You have logged out successfully</h1>
      </div>
      <div>
        <p className="text-lg">
          Want to login back?
          <Link to="/login" className="text-stone-500">
            {'  '}
            Click here
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Logout;
