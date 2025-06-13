import { useEffect, useState } from "react";
import { InputField } from "../../common/InputField";
import { Button } from "../../common/Button";
import { FaUser } from "react-icons/fa6";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Pagination } from "../../common/Pagination";
import { IoMdSearch } from "react-icons/io";
import { getCategories } from "../../Commonapicall/Categoriesapicall/Categoriesapis";
import { DeleteCategoryPopup } from "./DeleteCategoryPopup";
import { NotifyError } from "../../common/Toast/ToastMessage";
import { AddCategoryPopup } from "./AddCategoryPopup";
import { CategoryTableShimmer } from "../../components/ShimmerLoading/ShimmerTable/CategoryTableShimmer";
import { EditCategoryPopup } from "./EditCategoryPopup";

interface Category {
  id: number;
  category: string;
  status: boolean;
  is_deleted: boolean;
}

export interface CategoryApiResponse {
  count: number;
  next: string;
  previous: string;
  results: Category[]
}

export const CategoriesTable = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [showEditCategoryPopup, setShowEditCategoryPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteCategoryPopup, setShowDeleteCategoryPopup] = useState(false);
  const [categoryToDelete, setcategoryToDelete] = useState<{ id: number, name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories(currentPage, itemsPerPage) as CategoryApiResponse;
        //setCategories(data.results); // adjust if API returns { results: [...] }      setTotalCount(response.count);
        setCategories(Array.isArray(data.results) ? data.results : []);
        setTotalCount(data.count);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [currentPage, itemsPerPage]);

  const refreshCategoryList = async () => {
    try {
      setLoading(true);
      const response = await getCategories(currentPage, itemsPerPage) as CategoryApiResponse;
      setCategories(response.results);
    } catch (err) {
      NotifyError(err instanceof Error ? err.message : "Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const openDeleteCategoryPopup = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setcategoryToDelete({ id: category.id, name: category.category });
    setShowDeleteCategoryPopup(true);
  };

  const closeDeleteCategoryPopup = () => {
    setShowDeleteCategoryPopup(false);
    setcategoryToDelete(null);
  }

  const openAddCategoryPopup = () => {
    setShowAddCategoryPopup(true);
  }

  const closeAddCategoryPopup = () => {
    setShowAddCategoryPopup(false);
  }

  const openEditCategoryPopup = (category: any) => {
    setShowEditCategoryPopup(true);
    setSelectedCategory(category);
  }

  const closeEditCategoryPopup = () => {
    setShowEditCategoryPopup(false);
  }

  return (
    <div className="p-6">
      <div className="bg-white px-5 py-1 rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-2 py-2">
          <div className="flex items-center">
            <span className="text-2xl font-bold">Categories</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={openAddCategoryPopup}
              buttonType="button"
              buttonTitle="Add Category"
              icon={
                <div className="relative w-4 h-4">
                  <FaUser className="w-4 h-4 text-current" />
                  <span className="absolute -top-1.5 -left-2 text-current text-[15px] font-bold">
                    +
                  </span>
                </div>
              }
              className="flex items-center gap-2 bg-armsjobslightblue text-armsWhite border border-armsjobslightblue rounded px-4 py-2 font-bold hover:text-armsjobslightblue hover:bg-armsWhite transition-colors duration-200"
            />
            <div className="relative w-[300px]">
              <InputField
                type="text"
                placeholder="Search"
                className="w-full rounded-[5px] border-[1px] border-armsgrey pl-2 pr-2 py-1.5 focus-within:outline-none"
                label=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IoMdSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-armsgrey text-[18px]" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          {loading ? (
            <CategoryTableShimmer />
          ) : (
            <table className="w-full table-auto text-sm">
              <thead className="bg-main text-left">
                <tr className="text-armsWhite whitespace-nowrap">
                  <th className="bg-main px-2 py-3">Category Name</th>
                  <th className="bg-main px-2 py-3">Status</th>
                  <th className="bg-main px-2 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="whitespace-nowrap">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="text-center py-8">
                      <p className="text-center py-4">No categories found</p>
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="border-b-2 border-armsgrey">
                      <td className="px-2 py-2">{category.category}</td>
                      <td className="px-2 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${category.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {category.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-2 py-3 sticky right-0 z-10 bg-armsWhite border-b-2 border-armsgrey">
                        <div className="flex items-center space-x-2">
                          {/* Edit */}
                          <div
                            onClick={() => openEditCategoryPopup(category)}
                            className="relative flex items-center justify-center border border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200"
                          >
                            <MdModeEdit className="text-white group-hover:text-armsjobslightblue text-xl" />
                            <div
                              onClick={() => openEditCategoryPopup(category)}
                              className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                              Edit
                            </div>
                          </div>

                          {/* Delete */}
                          <div className="relative flex items-center justify-center border border-armsjobslightblue rounded-full px-2 py-2 cursor-pointer group bg-armsjobslightblue hover:bg-white transition-all duration-200">
                            <MdDelete
                              onClick={(e) => openDeleteCategoryPopup(category, e)}
                              className="text-white group-hover:text-armsjobslightblue text-xl" />
                            <div
                              onClick={(e) => openDeleteCategoryPopup(category, e)}
                              className="absolute -top-6.5 bg-armsjobslightblue text-armsWhite text-xs font-semibold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
                              Delete
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )) )}
                {/* {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                )} */}
              </tbody>
            </table>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* popups */}
      {showAddCategoryPopup &&
        (
          <AddCategoryPopup
            closePopup={closeAddCategoryPopup}
            refreshData={refreshCategoryList}
          />
        )}

      {showEditCategoryPopup && selectedCategory &&
        (
          <EditCategoryPopup
            closePopup={closeEditCategoryPopup}
            EditCategory={selectedCategory}
            refreshData={refreshCategoryList}
          />
        )}


      {showDeleteCategoryPopup && categoryToDelete &&
        (<DeleteCategoryPopup
          closePopup={closeDeleteCategoryPopup}
          CategoryData={categoryToDelete}
          refreshData={refreshCategoryList}
        />)}
    </div>
  );
};
