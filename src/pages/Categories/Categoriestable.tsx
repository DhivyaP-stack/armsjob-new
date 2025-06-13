import { useCallback, useEffect, useState } from "react";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { Pagination } from "../../common/Pagination";
import { getCategories } from "../../Commonapicall/Categoriesapicall/Categoriesapis";
import { DeleteCategoryPopup } from "./DeleteCategoryPopup";
import { CategoryTableShimmer } from "../../components/ShimmerLoading/ShimmerTable/CategoryTableShimmer";
import { EditCategoryPopup } from "./EditCategoryPopup";

interface CategoriesTableProps {
  searchQuery?: string;
  refreshTrigger?: boolean;
}
export interface Category {
  id: number;
  category: string;
  status: boolean;
  is_deleted: boolean;
}

export interface TestimonialData {
  status: string;
  message: string;
  data: Category[];
}

export interface CategoryApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TestimonialData;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({ searchQuery = "", refreshTrigger }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showEditCategoryPopup, setShowEditCategoryPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showDeleteCategoryPopup, setShowDeleteCategoryPopup] = useState(false);
  const [categoryToDelete, setcategoryToDelete] = useState<{ id: number, name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const loadcategorylist = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCategories(currentPage, searchQuery.trim(), itemsPerPage.toString()) as CategoryApiResponse// Pass the page size as string);
      if (!response?.results?.data) {
        setCategories([]);
        setTotalCount(0);
        return;
      }
      setCategories(response?.results?.data);
      setTotalCount(response.count || 0);
    } catch (error) {
      console.error("Error fetching pagination data:", error);
      setCategories([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, itemsPerPage]);

  useEffect(() => {
    loadcategorylist();
  }, [currentPage, searchQuery, itemsPerPage, refreshTrigger]);

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
                  )))}
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

      {showEditCategoryPopup && selectedCategory &&
        (
          <EditCategoryPopup
            closePopup={closeEditCategoryPopup}
            EditCategory={selectedCategory}
            refreshData={loadcategorylist}
          />
        )}

      {showDeleteCategoryPopup && categoryToDelete &&
        (<DeleteCategoryPopup
          closePopup={closeDeleteCategoryPopup}
          CategoryData={categoryToDelete}
          refreshData={loadcategorylist}
        />)}
    </div>
  );
};
