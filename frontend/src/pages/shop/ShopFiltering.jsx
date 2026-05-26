import React, { useState } from 'react'

const ShopFiltering = ({filters, categoryGroups, filtersState, setFiltersState, clearFilters}) => {
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    const colorTranslations = {
        'all': 'Tất cả',
        'black': 'Đen',
        'red': 'Đỏ',
        'gold': 'Vàng',
        'blue': 'Xanh dương',
        'silver': 'Bạc',
        'beige': 'Be',
        'green': 'Xanh lá'
    };

    return (
        <div className="space-y-5 flex-shrink-0 ">
            <h3>Bộ lọc</h3>

            {/* Categories */}
            <div className="flex flex-col space-y-2">
                <h4 className='font-medium text-lg'>Danh mục</h4>
                <hr />
                <label className='capitalize cursor-pointer flex items-center'>
                    <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={filtersState.category === 'all'}
                        onChange={e => setFiltersState({ ...filtersState, category: e.target.value })}
                    />
                    <span className='ml-1 font-bold lowercase first-letter:uppercase'>Tất cả</span>
                </label>

                {categoryGroups.map(group => {
                    const isExpanded = expandedGroups[group.name];
                    return (
                        <div key={group.name} className="mt-2 text-sm">
                            <div 
                                className="flex justify-between items-center cursor-pointer bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors"
                                onClick={() => toggleGroup(group.name)}
                            >
                                <h5 className="font-bold lowercase first-letter:uppercase text-gray-800">{group.name}</h5>
                                <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line text-lg`}></i>
                            </div>
                            
                            {isExpanded && (
                                <div className="ml-4 flex flex-col space-y-1 mt-2 animate-fadeIn">
                                    {group.subcategories.map(sub => (
                                        <label key={sub.value} className='capitalize cursor-pointer hover:text-primary transition-colors flex items-center py-1'>
                                            <input
                                                type="radio"
                                                name="category"
                                                value={sub.value}
                                                checked={filtersState.category === sub.value}
                                                onChange={e => setFiltersState({ ...filtersState, category: e.target.value })}
                                            />
                                            <span className='ml-2 text-gray-600'> {sub.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Colors */}
            <div className="flex flex-col space-y-2">
                <h4 className='font-medium text-lg'>Màu sắc</h4>
                <hr />
                {filters.colors.map(color => (
                    <label key={color} className='capitalize cursor-pointer flex items-center'>
                        <input
                            type="radio"
                            name="color"
                            value={color}
                            checked={filtersState.color === color}
                            onChange={e => setFiltersState({ ...filtersState, color: e.target.value })}
                        />
                        <span className='ml-2'>{colorTranslations[color] || color}</span>
                    </label>
                ))}
            </div>

            {/* Price Ranges */}
            <div className="flex flex-col space-y-2">
                <h4 className='font-medium text-lg'>Khoảng giá</h4>
                <hr />
                {filters.priceRanges.map(range => (
                    <label key={range.label} className='capitalize cursor-pointer flex items-center'>
                        <input
                            type="radio"
                            name="priceRange"
                            value={`${range.min}-${range.max}`}
                            checked={filtersState.priceRange === `${range.min}-${range.max}`}
                            onChange={e => setFiltersState({ ...filtersState, priceRange: e.target.value })}
                        />

                        <span className='ml-2'>{range.label}</span>
                    </label>
                ))}
            </div>

            {/* Clear Filters Button */}
            <button className="bg-primary py-2 px-4 text-white rounded w-full hover:bg-primary-dark transition-colors mt-4" onClick={clearFilters}>
                Xóa tất cả bộ lọc
            </button>
        </div>
    )
}

export default ShopFiltering