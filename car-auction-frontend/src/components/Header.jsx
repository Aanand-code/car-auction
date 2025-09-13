import { useState } from 'react';
import { TbSteeringWheelFilled } from 'react-icons/tb';
import { TbSteeringWheelOff } from 'react-icons/tb';
import Menu from './Menu.jsx';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="p-5 flex flex-row w-full justify-between items-center">
      <div className="font-josefin  text-3xl mt-2">AUCTION</div>
      <button onClick={() => setMenuOpen((prev) => !prev)}>
        {menuOpen ? (
          <TbSteeringWheelOff className="w-7 h-7 self-center" />
        ) : (
          <TbSteeringWheelFilled className="w-7 h-7" />
        )}
      </button>
      {menuOpen && <Menu onClose={() => setMenuOpen(false)} />}
    </header>
  );
};

export default Header;
