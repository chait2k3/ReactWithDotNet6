import { Box, Typography, Pagination } from "@mui/material";
import { FC, useState } from "react";
import { MetaData } from '../models/pagination';

interface AppPaginationProps {
    metaData: MetaData,
    onPageChange: (page: number) => void
 }

const AppPagination: FC<AppPaginationProps> = (props) => {
    const { currentPage, pageSize, totalCount, totalPages } = props.metaData;
    const [pageNumber, setPageNumber] = useState(currentPage);
  
    const handlePageChange = (page: number) => {
      setPageNumber(page);
      props.onPageChange(page);
    };

    return (
    <Box display="fles" justifyContent="space-between" alignItems="center">
      <Typography>
        Displaying items {
        (currentPage-1) * pageSize + 1 
        }-{
        currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize
        } of {totalCount} product(s)
        </Typography>
      <Pagination
        color="secondary"
        size="large"
        count={totalPages}
        page={pageNumber}
        onChange={(_, page) => handlePageChange(page)}
      />
    </Box>
  );
};

export default AppPagination;
