import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queries";
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const {ref, inView} = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState("")

  const debouncedValue = useDebounce(searchValue, 500)
  const {data: searchedPosts, isFetching: isSearchFetching} = useSearchPosts(debouncedValue)

  useEffect(() => {
    if(inView && !searchValue){
      fetchNextPage()
    }
  }, [inView, searchValue])
  

  if(!posts){
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader/>
      </div>
    )
  }
 
  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item) => item?.documents.length === 0)

  return (
    <div className="flex flex-col flex-1 items-center overflow-y-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>

        <div className="flex px-4 gap-1 w-full bg-dark-4 rounded-lg"> 
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input 
            type="text"
            placeholder="Search"
            className="h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0 !important"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        
        <div className="flex items-center justify-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img 
            src="/assets/icons/filter.svg"
            alt="filter"
            width={20}
            height={20}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
            
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : posts.pages.map((item, index) => (
          <GridPostList key={`page-${index}`} 
          posts={item!.documents}
          />
        ))}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className='mt-10'>
          <Loader/>
        </div>
      )}
    </div>
  )
}

export default Explore