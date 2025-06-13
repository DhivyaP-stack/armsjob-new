import { Link, NavLink, useNavigate } from 'react-router-dom';
import ArmsLogo from "../assets/images/armslogo.jpg"
// import Settings from '../assets/icons/Settings.jpg'
import NotificationBell from "../assets/icons/NotificationBell.jpg"
import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { FaCircleUser } from 'react-icons/fa6';
import { IoMdSettings } from 'react-icons/io';

export const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    navigate("/");
    sessionStorage.clear();
  }

  return (
    <header>
      <div className="relative backdrop-blur-lg bg-opacity-100 shadow-md px-10 py-5 pb-0 max-2xl:pb-5 max-xl:pb-5 z-[11]">
        <div className="flex flex-wrap max-sm:!flex-nowrap justify-between items-center max-2xl:gap-x-12 max-2xl:gap-y-5 max-2xl:justify-between">
          <div className="flex justify-center items-center space-x-3 max-2xl:order-1">
            <Link to="/Dashboard">
              <img src={ArmsLogo} alt="Logo" className="h-15 pb-4 max-sm:!h-12 max-sm:pt-2 max-sm:pb-0 " />
            </Link>
          </div>

          <div className="max-sm:!hidden max-md:!hidden max-2xl:order-3 max-2xl:mx-auto">
            <nav className="">
              <ul className="flex items-center space-x-3 max-xl:space-x-6">
                <NavLink
                  to="/Dashboard"
                  className="active-nav max-2xl:before:!-bottom-5"
                  aria-current="page"
                >
                  <li className="text-md max-xl:text-sm">Dashboard</li>
                </NavLink>
                <NavLink
                  to="/Candidate"
                  className="active-nav max-2xl:before:!-bottom-5"
                  aria-current="page"
                >
                  <li className="text-md max-xl:text-sm">Candidate(New/Own Visa)</li>
                </NavLink>
                {/* <li>
                <NavLink to="/UAEOwnFreeLauncerVisa" className="active-nav text-black font-bold">UAE Own/Freelancer Visa</NavLink>
              </li> */}
                <NavLink
                  to="/AgentsSupplier"
                  className="active-nav max-2xl:before:!-bottom-5"
                  aria-current="page"
                >
                  <li className="text-md max-xl:text-sm">Manpower Supply Company/Agents</li>
                </NavLink>

                {/* <NavLink
                  to="/ManpowerSupply"
                  className="active-nav max-2xl:before:!-bottom-5"
                  aria-current="page"
                >
                  <li className="text-md max-xl:text-sm">ManPower Supply Company</li>
                </NavLink> */}

                <NavLink
                  to="/OverseasRecruitment"
                  className="active-nav max-2xl:before:!-bottom-5"
                  aria-current="page"
                >
                  <li className="text-md max-xl:text-sm">Overseas Recruitment Agencies</li>
                </NavLink>

                <NavLink
                  to="/ClientEnquiry"
                  className="active-nav max-2xl:before:!-bottom-5"
                  aria-current="page"
                >
                  <li className="text-md max-xl:text-sm">Client Enquiry</li>
                </NavLink>

                {/* <NavLink
                  to="/Categories"
                  className="active-nav max-2xl:before:!-bottom-5"
                  aria-current="page"
                >
                  <li className="text-md max-xl:text-sm">Categories</li>
                </NavLink> */}

                <NavLink
                  to="/Reports"
                  className="active-nav max-2xl:before:!-bottom-5"
                  aria-current="page"
                >
                  <li className="text-md max-xl:text-sm">Reports</li>
                </NavLink>
              </ul>
            </nav>
          </div>

          <div className="flex items-center space-x-5 2xl:space-x-5 max-2xl:order-2 cursor-pointer">
            <div className="relative group cursor-pointer flex items-center justify-center">
              <button className="text-gray-700">
                <NavLink to="/Settings">
                  <IoMdSettings className="w-5 h-5 object-cover text-armsjobslightblue" />
                </NavLink>
              </button>
            </div>
            <button className="text-gray-700">
              <img
                src={NotificationBell}
                alt="notigication"
                className="w-4 h-4 object-cover  cursor-pointer"
              />
            </button>
            <div className="relative group cursor-pointer flex items-center justify-center">
              {/* Profile Button */}
              <div className="rounded-full flex items-center justify-center px-2 py-1">
                <FaCircleUser className="w-9 h-9 max-sm:w-7 max-sm:h-7 text-armsjobslightblue cursor-pointer " />
                <span className="text-armsBlack font-bold ml-2 max-sm:!hidden">shana</span>
              </div>

              {/* Dropdown on Hover */}
              <div className="absolute  right-0 mt-38 w-40  bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1001]">
                <div className="block px-4 py-2 text-sm text-armsBlack hover:bg-gray-100">My Profile</div>
                <div className="block px-4 py-2 text-sm text-armsBlack hover:bg-gray-100">Password Reset</div>
                <div
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-armsBlack hover:bg-gray-100">Sign Out</div>
              </div>

              {/* Hamburger (visible only on small screens) */}
              <div className="block xl:!hidden md:!hidden max-2xl:order-2">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 focus:outline-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden fixed items-center w-[300px] right-0 top-0 h-full bg-armsWhite shadow-lg z-50  duration-300">
          <div className='text-end'>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-3 text-gray-600"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>
          <nav className="flex flex-col bg-armsWhite space-y-4 p-4 ">
            <NavLink to="/Dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            <NavLink to="/Candidate" onClick={() => setMenuOpen(false)}>Candidate</NavLink>
            <NavLink to="/AgentsSupplier" onClick={() => setMenuOpen(false)}>Agents/Supplier</NavLink>
            <NavLink to="/ManpowerSupply" onClick={() => setMenuOpen(false)}>ManPower Supply Company</NavLink>
            <NavLink to="/OverseasRecruitment" onClick={() => setMenuOpen(false)}>Overseas Recruitment Agencies</NavLink>
            <NavLink to="/ClientEnquiry" onClick={() => setMenuOpen(false)}>Client Enquiry</NavLink>
            <NavLink to="/Reports" onClick={() => setMenuOpen(false)}>Reports</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}


