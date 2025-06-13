import React from 'react'

export const CategoryTable: React.FC = () => {
    return (
        <div>
            <table className="w-full table-auto text-sm">
                <thead className="bg-main text-left">
                    <tr className="text-armsWhite whitespace-nowrap">
                        <th className="bg-main px-2 py-3">Category Name</th>
                        <th className="bg-main px-2 py-3">Status</th>
                        <th className="bg-main px-2 py-3">Actions</th>
                    </tr>
                </thead>
            </table>
        </div>
    )
}
