import React from 'react';

import { useSearchParams } from 'react-router-dom';

import { Pagination } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getPage } from '../selectors';

const AppPagination = ({ totalPages, dispatchPage = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  let currentPage = useSelector(getPage) || 1;

  if (!dispatchPage) currentPage = searchParams.get('page') * 1 || 1;

  let pageToRender =
    currentPage === 1
      ? 2
      : currentPage === totalPages
      ? currentPage - 1
      : currentPage;

  let pages = [1, totalPages];
  pages = [...pages, pageToRender - 1, pageToRender, pageToRender + 1];

  pages = pages.sort((a, b) => a - b);
  pages = pages.filter((page) => page > 0 && page <= totalPages);
  pages = Array.from(new Set(pages));

  let pagesToRender = [];
  pages.forEach((page, idx) => {
    if (idx > 0) {
      if (page - pages[idx - 1] > 2) pagesToRender.push('...');
      else if (page - pages[idx - 1] === 2) pagesToRender.push(page - 1);
    }
    pagesToRender.push(page);
  });

  return (
    totalPages > 1 && (
      <Pagination
        className="mt-5"
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {pagesToRender.map((page, idx) => (
          <Pagination.Item
            key={idx}
            active={page === currentPage}
            onClick={() => {
              if (page === '...') return;

              if (!dispatchPage) {
                const currentParams = Object.fromEntries(
                  searchParams.entries()
                );
                const updatedParams = { ...currentParams, page };
                setSearchParams(updatedParams);
              } else {
                dispatchPage(page);
              }
            }}
          >
            {page}
          </Pagination.Item>
        ))}
      </Pagination>
    )
  );
};
export default AppPagination;
