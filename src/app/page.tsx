"use client"
import Home from 'src/app/(page)/restaurant/page';
import './globals.css'
import StoreProvider from './StoreProvider';
import { SearchProvider, useSearchContext } from './components/SearchContext';
import { useEffect, useState } from 'react';
import TabFeatures from './(page)/restaurant/page2';




const Page = () => {
    const { searchTerm } = useSearchContext();
    const [showHome, setShowHome] = useState(false);



    useEffect(() => {
        setShowHome(!!searchTerm); // 검색어가 있을 경우 Home 컴포넌트를 보여주는
    }, [searchTerm]);

    return (
        <StoreProvider>
            {showHome ? <Home /> : <TabFeatures start={0} limit={20} />}
        </StoreProvider>
    );
};

export default Page;