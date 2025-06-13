// components/Dashboard/Dashboard.tsx
import { CategoriesTable } from "./Categories/Categoriestable";

export const Categories=()=>{
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Header /> */}
      <CategoriesTable/>
    </div>
  );
}