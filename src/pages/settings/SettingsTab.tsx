import { useState } from 'react'
import { InputField } from '../../common/InputField'
import { IoMdSearch } from 'react-icons/io'
import { FaUser } from 'react-icons/fa6';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { CategoriesTable } from '../Categories/Categoriestable';
import { BlogTable } from '../SettingTable/BlogTable';
import { TestimonialTable } from '../SettingTable/TestimonialTable';
import { JobpostingTable } from '../SettingTable/JobpostingTable';
import { CanditebenchlistTable } from '../SettingTable/CandidatebenchlistTable';
import { AddJobPostingPopup } from '../../components/JobPostingpopups/AddJobPostingPopup';
import { AddCandidateBenchListPopup } from '../../components/CandidateBenchPopups/AddCandidateBenchListPopup';
import { AddBlogPopup } from '../../components/BlogPopups/AddBlogPopup';
import { AddTestimonialPopup } from '../../components/TestimonialPopups/AddTestimonialPopup';
import { AddCategoryPopup } from '../Categories/AddCategoryPopup';

export const SettingsTab = () => {
    const [activeTab, setActiveTab] = useState('Categories');
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const menuItems = [
        'Categories',
        'Job Posting',
        'Candidate Bench List',
        'Blog',
        'Testimonial',
    ];

    const handleAddClick = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
    };

    const handleRefreshData = () => {
         setRefreshTrigger(prev => !prev);
    };

    const renderPopup = () => {
        switch (activeTab) {
            case 'Job Posting':
                return (
                    <AddJobPostingPopup
                        closePopup={handleClosePopup}
                        refreshData={handleRefreshData}
                    />
                );
            case 'Categories':
                return (
                    <AddCategoryPopup
                        closePopup={handleClosePopup}
                        refreshData={handleRefreshData}
                    />
                );
            case 'Blog':
                return (
                    <AddBlogPopup
                        closePopup={handleClosePopup}
                        refreshData={handleRefreshData}
                    />
                );
            case 'Testimonial':
                return (
                    <AddTestimonialPopup
                        closePopup={handleClosePopup}
                        refreshData={handleRefreshData}
                    />
                );
            case 'Candidate Bench List':
                return (
                    <AddCandidateBenchListPopup
                        closePopup={handleClosePopup}
                        refreshData={handleRefreshData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className='bg-white min-h-screen p-4'>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold  py-4 ">Settings</h2>
                {/* <h1 className="text-2xl font-bold">{activeTab}</h1> */}

                {/* Search Input */}
                <div className="relative w-[270px] max-sm:w-full">
                    <InputField
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full rounded-[5px] border border-armsgrey pl-2 pr-2 py-1.5 focus:outline-none"
                        label=""
                    />
                    <IoMdSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black text-[20px]" />
                </div>
            </div>
            <div className="flex ">
                {/* Left Sidebar */}
                <aside className="w-50 border border-main rounded  h-[600px]">

                    <nav className="flex flex-col">
                        {menuItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => setActiveTab(item)}

                                className={`flex items-center justify-items-start py-5 text-left border-b ${activeTab === item
                                    ? 'bg-main text-white'
                                    : 'hover:bg-gray-100'
                                    }`}
                            >
                                {/* <FaAngleRight className="text-sm" /> */}
                                <span className="ml-2 text-xl"><MdOutlineKeyboardArrowRight /></span>
                                <span className='font-semibold'>{item}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-4">
                    {/* Content placeholder */}
                    <div className="border border-black-300 rounded p-4 min-h-screen">
                        {/* Top Right Add Button */}
                        <div className="flex justify-between mb-4">
                            <h1 className="text-2xl font-bold">{activeTab}</h1>
                            <button
                                onClick={handleAddClick}
                                className="bg-armsjobslightblue hover:bg-armsWhite hover:border-armsjobslightblue border-1 hover:text-armsjobslightblue text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-semibold"
                            >
                                {/* <span className="text-lg "></span> */}
                                <div className="flex items-center gap-1">
                                    <div className="relative w-4 h-4">
                                        <FaUser className="w-4 h-4 text-current" />
                                        <span className="absolute -top-1.5 -left-2 text-current text-[15px] font-bold">+</span>
                                    </div>
                                </div>
                                {activeTab}
                            </button>
                        </div>
                        <div>
                            {activeTab === "Categories" && (
                                <CategoriesTable  searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
                            )}
                            {activeTab === "Blog" && (
                                <BlogTable />
                            )}
                            {activeTab === "Testimonial" && (
                                <TestimonialTable searchQuery={searchQuery} refreshTrigger={refreshTrigger}/>
                            )}
                            {activeTab === "Job Posting" && (
                                <JobpostingTable searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
                            )}
                            {activeTab === "Candidate Bench List" && (
                                <CanditebenchlistTable searchQuery={searchQuery} refreshTrigger={refreshTrigger}/>
                            )}

                        </div>
                    </div>
                </main>
            </div>
            {showAddPopup && renderPopup()}
        </div>

    );
};

