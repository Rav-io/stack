import { useState, useEffect } from "react";
import axios from 'axios';
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import TagDetailsModal from './TagDetailsModal';
import CircularProgress from '@mui/material/CircularProgress';

interface Tag {
    name: string;
    count: number;
}

const TagList = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(20);
    const [sortType, setSortType] = useState<'name' | 'count'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
    const [showTagDetails, setShowTagDetails] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                let allTags: Tag[] = [];
                await new Promise(resolve => setTimeout(resolve, 10000));
                for (let page = 1; page <= 25; ++page) {
                    const response = await axios.get(`https://api.stackexchange.com/2.3/tags?page=${page}&pagesize=100&order=desc&sort=popular&site=stackoverflow`);
                    const data = response.data;
                    if (data) {
                        const tags: Tag[] = data.items.map((item: any) => ({ name: item.name, count: item.count }));
                        allTags = allTags.concat(tags);
                    }
                }
                setTags(allTags);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchTags();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (type: 'name' | 'count') => {
        if (sortType === type) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortType(type);
            setSortDirection('asc');
        }
    };

    const sortedTags = [...tags].sort((a, b) => {
        return sortType === 'name' 
        ? (sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
        : (sortDirection === 'asc' ? a.count - b.count : b.count - a.count);
    });

    const handleItemClick = (tag: Tag) => {
        setSelectedTag(tag);
        setShowTagDetails(true);
    };

    const handleCloseModal = () => {
        setShowTagDetails(false);
    };

    return (
        <div>
            <h2 className="tagListHead">Stack Exchange Tags</h2>
            {loading ? (<div className="loading"><CircularProgress /> Fetching data... </div>) : (
            <>
            <TablePagination
                rowsPerPageOptions={[10, 20, 30, 50, 100]}
                component="div"
                count={tags.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>
                                <TableSortLabel
                                    active={sortType === 'name'}
                                    direction={sortDirection}
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortType === 'count'}
                                    direction={sortDirection}
                                    onClick={() => handleSort('count')}
                                >
                                    Count
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody >
                            {sortedTags.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tag, i) => (
                                <TableRow key={i} hover={true} onClick={() => handleItemClick(tag)}>
                                    <TableCell className="nameCell">{tag.name}</TableCell>
                                    <TableCell className="countCell">{tag.count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                </Table>
            </TableContainer>
            {showTagDetails && selectedTag && <TagDetailsModal name={selectedTag.name} count={selectedTag.count} onClose={handleCloseModal}/>}
            </>
        )}
        </div>
    );
}

export default TagList;
