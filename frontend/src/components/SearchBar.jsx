function SearchBar({ searchText, setSearchText }) {
  return (
    <div className="mt-8">
      <input
        type="text"
        placeholder="Search events..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className="w-full md:w-96 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default SearchBar