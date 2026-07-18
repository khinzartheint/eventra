function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  const categories = [
    { name: "All", icon: "🎫" },
    { name: "Music", icon: "🎵" },
    { name: "K-Pop", icon: "🎤" },
    { name: "Food", icon: "🍔" },
  ]

  return (
    <div className="flex flex-wrap gap-3 mt-6 mb-8">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => setSelectedCategory(category.name)}
          className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
            selectedCategory === category.name
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.icon} {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter